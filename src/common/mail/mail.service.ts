import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
  }

  async sendPasswordResetEmail(email: string, resetLink: string) {
    const from = this.configService.get<string>('EMAIL_FROM');

    try {
      await this.resend.emails.send({
        from: from || 'Track Finances <onboarding@resend.dev>',
        to: email,
        subject: 'Recuperação de Senha - Track Finances',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #10b981;">Track Finances</h2>
            <p style="color: #1e293b;">Olá,</p>
            <p style="color: #1e293b;">Você solicitou a redefinição de sua senha no Track Finances. Clique no botão abaixo para criar uma nova senha:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
            </div>
            <p style="color: #64748b; font-size: 14px;">Este link expira em 1 hora.</p>
            <p style="color: #64748b; font-size: 14px;">Se você não solicitou isso, pode ignorar este e-mail com segurança.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">© 2026 Track Finances Team</p>
          </div>
        `,
      });
      this.logger.log(`E-mail de recuperação enviado para: ${email}`);
    } catch (error) {
      this.logger.error(`Falha ao enviar e-mail para ${email}:`, error);
      throw error;
    }
  }
}
