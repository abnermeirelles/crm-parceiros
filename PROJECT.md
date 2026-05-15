# CRM de Parceiros

## Resumo

Aplicação interna para controle de parcerias no segmento de suplementos alimentares. O MVP usa Next.js App Router, TypeScript, Prisma ORM, PostgreSQL 17, autenticação por e-mail/senha e upload de fotos em storage compatível com S3/MinIO.

## Stack

- Frontend e backend: Next.js com Server Components e Server Actions.
- Banco de dados: PostgreSQL 17 via `DATABASE_URL`.
- ORM/migrations: Prisma.
- Login: NextAuth Credentials com sessão JWT.
- Upload de fotos: MinIO/S3. O banco salva `photoKey` e `photoUrl`.
- Deploy planejado: Docker Swarm com Portainer e Traefik.

## Entidades

- `Partner`: parceiro pessoa física ou empresa, com contato, documentos, redes sociais, endereço, CAT, profissão, valores de consulta/aula, status, pontos de prescrição e foto.
- `PartnerType`: tipos como Nutricionista, Educador Físico, Academias, Influenciadores e Médicos.
- `Profession`, `Category`, `ServiceValue`: cadastros auxiliares usados nos dropdowns.
- `Event`: evento com data, tipo, investimento, total de participantes, prêmios e parceiros participantes.
- `Visit`: visita recebida por parceiro, com data/hora, equipe envolvida e brinde.
- `AwardCatalog` e `PartnerAward`: catálogo de premiações e histórico por parceiro.
- `RelationshipTeamMember`: equipe de relacionamento.
- `User`: usuário interno para login.

## Comandos Locais

1. Copiar `.env.example` para `.env` e ajustar `DATABASE_URL`, `AUTH_SECRET` e dados do MinIO/S3.
2. Instalar dependências: `npm install`.
3. Gerar client Prisma: `npm run prisma:generate`.
4. Criar as tabelas: `npm run prisma:migrate -- --name init`.
5. Popular dados iniciais: `npm run prisma:seed`.
6. Rodar localmente: `npm run dev`.

Usuário inicial do seed, caso não altere o `.env`: `admin@empresa.com` / `admin123`.

## Variáveis de Ambiente

- `DATABASE_URL`: conexão PostgreSQL.
- `AUTH_SECRET`: segredo do NextAuth.
- `NEXTAUTH_URL`: URL base da aplicação.
- `WEBHOOK_SECRET`: token enviado pelo n8n no header `x-webhook-secret` para cadastrar parceiros via webhook.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`: usuário inicial do seed.
- `S3_ENDPOINT`, `S3_PORT`, `S3_USE_SSL`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_REGION`, `S3_PUBLIC_BASE_URL`: configuração do MinIO/S3.

## Próximas Evoluções

- Relatórios de performance por parceiro, evento, CAT e profissão.
- Perfis e permissões por tipo de usuário.
- Automação do campo de pontos de prescrição.
- Controle estruturado de brindes por produto/marca.
- Stack file específico para Portainer/Traefik em produção.

## Deploy no Docker Swarm

- A imagem Docker é publicada pelo GitHub Actions em `ghcr.io/abnermeirelles/crm-parceiros:latest`.
- O stack base fica em `deploy/docker-stack.yml`.
- No Portainer, crie uma Stack apontando para o repositório GitHub e use o arquivo `deploy/docker-stack.yml`.
- Domínio de produção: `cat.nexasource.com.br`.
- Configure as variáveis da Stack no Portainer: `DATABASE_URL`, `AUTH_SECRET` e variáveis `S3_*`. `CRM_HOST` e `NEXTAUTH_URL` já possuem padrão para `cat.nexasource.com.br`, mas podem ser sobrescritos.
- O serviço usa duas redes externas do Swarm: `public_proxy` para o Traefik/acesso externo e `infra_internal` para acesso interno ao banco.
- O serviço está fixado para rodar no manager com `node.role == manager`.
- Para `DATABASE_URL` via rede interna do Swarm, use a porta interna do serviço Postgres, normalmente `postgres:5432`; não use a porta publicada externa como `52430` junto com o host interno `postgres`.
- O Traefik usa o cert resolver `le`.
- A imagem usa Alpine; para abrir terminal no container use `/bin/sh`, não `bash`.

## Webhook n8n

- Endpoint: `POST /api/webhooks/parceiros`.
- Header obrigatório: `x-webhook-secret: <WEBHOOK_SECRET>`.
- Campos aceitos: `nome`, `sobrenome`, `nomeCompleto`, `telefone`, `email`, `cpf`, `cnpj`, `instagram`, `cupom`, `profissao`, `observacoes`, `faixaMediaAtendimento`, `faixaMediaAulaHr`, `atendimentosMes`, `atendimento`, `areaAtuacao`, `endereco`, `numero`, `complemento`, `cep`, `bairro`, `cidade`, `estado`.
- Parceiros criados pelo webhook entram com status `Aguardando aprovação` e devem ser aprovados em `/parceiros/aprovacao`.
