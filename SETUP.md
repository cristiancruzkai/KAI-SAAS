# KAI-SAAS - Instrucciones de Setup

## Requisitos Previos

Este proyecto requiere versiones específicas de Node.js y pnpm para garantizar compatibilidad entre diferentes máquinas.

### Versiones Requeridas:
- **Node.js**: v22.16.0 (especificado en `.nvmrc`)
- **pnpm**: v10.24.0 o superior

## Setup Inicial

### 1. Instalar Node.js v22.16.0

**Opción A: Usando nvm (recomendado)**
```bash
# Instalar nvm si no lo tienes: https://github.com/nvm-sh/nvm
nvm install 22.16.0
nvm use 22.16.0
```

**Opción B: Usando fnm (alternativa)**
```bash
# Instalar fnm si no lo tienes: https://github.com/Schniz/fnm
fnm install 22.16.0
fnm use 22.16.0
```

**Opción C: Descarga directa**
- Descargar de: https://nodejs.org/

### 2. Instalar pnpm v10.24.0 o superior

```bash
npm install -g pnpm@10.24.0
```

### 3. Verificar versiones instaladas

```bash
node --version  # Debe mostrar: v22.16.0
pnpm --version  # Debe mostrar: 10.24.0 o superior
```

### 4. Instalar dependencias del proyecto

```bash
# En la raíz del proyecto
cd app
pnpm install
```

### 5. Ejecutar el proyecto en desarrollo

```bash
# Para el dashboard
pnpm dev --filter dashboard

# O para todos los proyectos
pnpm dev
```

## Solución de Problemas Comunes

### Error: "Module not found" o "Cannot find module"
```bash
# Limpiar node_modules y reinstalar
cd app
rm -rf node_modules
pnpm install
```

### Error: "Next.js build failed"
```bash
# Limpiar cache de Next.js
cd app/apps/dashboard
rm -rf .next
cd ../..
pnpm dev --filter dashboard
```

### Error: "Turbo error" o cache issues
```bash
# Limpiar cache de Turbo
cd app
rm -rf .turbo
pnpm dev
```

### Las versiones no coinciden
Si la otra máquina tiene versiones diferentes de Node o pnpm, **DEBES** instalar las versiones específicas mencionadas arriba. El proyecto no funcionará correctamente con versiones diferentes.

## Estructura del Proyecto

```
KAI-SAAS/
├── app/                    # Frontend monorepo (Turbo)
│   ├── apps/
│   │   ├── dashboard/     # App principal (Next.js)
│   │   ├── docs/          # Documentación
│   │   └── web/           # Landing page
│   └── packages/          # Paquetes compartidos
├── backend/               # Backend (Firebase Functions)
└── functions/             # Firebase Functions principales
```

## Scripts Disponibles

```bash
# En /app

pnpm dev              # Ejecutar todos los proyectos en modo desarrollo
pnpm build            # Construir todos los proyectos
pnpm lint             # Ejecutar linter en todos los proyectos
pnpm format           # Formatear código con Prettier
```

## Notas Importantes

1. **NUNCA** subas las siguientes carpetas al repositorio:
   - `node_modules/`
   - `.next/`
   - `.turbo/`
   - `build/` o `dist/`

2. **SIEMPRE** usa `pnpm` (NO `npm` ni `yarn`) para instalar paquetes

3. Si cambias de rama, ejecuta `pnpm install` para asegurar que las dependencias estén actualizadas

4. El archivo `.nvmrc` en la raíz garantiza que todos usen la misma versión de Node

## Soporte

Si tienes problemas:
1. Verifica que estás usando las versiones correctas de Node y pnpm
2. Limpia caches: `.next/`, `.turbo/`, `node_modules/`
3. Reinstala dependencias: `pnpm install`
4. Si el problema persiste, contacta al equipo
