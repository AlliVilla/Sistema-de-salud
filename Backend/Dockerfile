FROM node:20-bullseye-slim

WORKDIR /app

RUN corepack enable

# Instala dependencias primero para aprovechar cache de capas
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "index.js"]