# 💰 MoneyTrack API

Backend robusto construído com **NestJS** para o ecossistema MoneyTrack. Gerencia transações financeiras, categorias e autenticação segura.

## 🚀 Tecnologias
- **NestJS**: Framework Node.js progressivo.
- **MongoDB**: Banco de dados NoSQL para flexibilidade.
- **Passport/JWT**: Autenticação segura.
- **Docker**: Containerização completa.

## 📋 Pré-requisitos
- Node.js (v20+)
- Docker e Docker Compose (Recomendado)

## 🐳 Rodando com Docker (Método mais rápido)
Este método sobe tanto a API quanto o Banco de Dados automaticamente.

1. Na raiz do projeto, execute:
   ```bash
   docker-compose up --build -d
   ```
2. A API estará disponível em `http://localhost:3000`.

## 💻 Rodando Localmente (Sem Docker)
Caso prefira rodar fora do Docker, você precisará de um MongoDB rodando localmente.

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o arquivo `.env` (use o `.env.example` como base):
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/moneytrack
   JWT_SECRET=sua_chave_secreta
   ```
3. Inicie em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```

## 🛠️ Scripts Disponíveis
- `npm run build`: Compila o projeto para produção.
- `npm run start:prod`: Executa a build de produção.
- `npm run test`: Executa os testes unitários.
- `npm run lint`: Verifica e corrige erros de estilo no código.

## 🔑 Variáveis de Ambiente
| Variável | Descrição | Valor Padrão |
| :--- | :--- | :--- |
| `PORT` | Porta de execução da API | `3000` |
| `MONGODB_URI` | String de conexão com o Mongo | `mongodb://localhost:27017/moneytrack` |
| `JWT_SECRET` | Chave secreta para tokens JWT | `mudar-em-producao` |

---
Desenvolvido por Antigravity para MoneyTrack.
