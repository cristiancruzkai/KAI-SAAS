# Dockerfile para KAI-SAAS Dashboard
FROM node:22.16.0-alpine

# Instalar pnpm
RUN npm install -g pnpm@10.24.0

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de pnpm workspace
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copiar todos los packages y apps
COPY packages ./packages
COPY apps ./apps

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Exponer puerto del dashboard
EXPOSE 3002

# Comando por defecto - ejecutar dashboard en desarrollo
CMD ["pnpm", "dev", "--filter", "dashboard"]
