import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { MailService } from '../common/mail/mail.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, refreshTokenHash, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  /**
   * Generates tokens and stores the hash of the refresh token in the DB.
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user._id, displayName: user.displayName };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      { sub: user._id, type: 'refresh' },
      { expiresIn: '7d' },
    );

    // Hash and save refresh token (Senior level: Never store tokens in plain text)
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(refreshToken, salt);
    await this.usersService.updateRefreshToken(user._id, hash);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
      },
    };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logout realizado com sucesso.' };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      if (decoded.type !== 'refresh') throw new UnauthorizedException();

      const user = await this.usersService.findById(decoded.sub);
      if (!user || !user.refreshTokenHash) throw new UnauthorizedException();

      // Validate refresh token hash
      const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!isMatch) throw new UnauthorizedException();

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Sessão expirada. Faça login novamente.');
    }
  }

  async register(email: string, pass: string, displayName: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('Não foi possível criar a conta.');
    
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(pass, salt);
    const user = await this.usersService.create(displayName, email, hash);
    return this.login(user);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    // Security: Do not reveal if user exists or not
    if (!user) return { message: 'Se o e-mail existir, um link de recuperação será enviado.' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    
    // Token expires in 1 hour (Absolute UTC math is safer for Docker/Timezones)
    const expires = new Date(Date.now() + 3600 * 1000);

    await this.usersService.updatePasswordReset(user._id.toString(), resetTokenHash, expires);

    // Dynamic URL from env (Senior practice)
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/#/reset-password?token=${resetToken}&email=${user.email}`;
    await this.mailService.sendPasswordResetEmail(user.email, resetLink);

    return { message: 'Se o e-mail existir, um link de recuperação será enviado.' };
  }

  async resetPassword(email: string, token: string, newPass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      throw new BadRequestException('Link de recuperação inválido ou expirado.');
    }

    // Check expiration
    if (new Date() > user.resetPasswordExpires) {
      throw new BadRequestException('Link de recuperação expirado.');
    }

    // Verify token hash
    const isMatch = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isMatch) {
      throw new BadRequestException('Link de recuperação inválido.');
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(newPass, salt);
    await this.usersService.updatePassword(user._id.toString(), hash);

    return { message: 'Senha atualizada com sucesso.' };
  }

  async updateProfile(userId: string, data: any) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();

    const updateData: any = {};

    if (data.email && data.email !== user.email) {
      const existing = await this.usersService.findByEmail(data.email);
      if (existing) throw new BadRequestException('E-mail já está em uso.');
      updateData.email = data.email;
    }

    if (data.displayName) {
      updateData.displayName = data.displayName;
    }

    if (data.password) {
      const salt = await bcrypt.genSalt(12);
      updateData.passwordHash = await bcrypt.hash(data.password, salt);
      updateData.refreshTokenHash = null; // Logout from other devices on password change
    }

    const updatedUser = await this.usersService.updateProfile(userId, updateData);
    if (!updatedUser) throw new BadRequestException('Erro ao atualizar perfil.');

    return this.login(updatedUser); // Return new tokens because displayName or email might have changed (payload)
  }

}
