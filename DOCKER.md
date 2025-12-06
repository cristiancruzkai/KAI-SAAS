# Docker Setup para KAI-SAAS

## Requisitos Previos

Solo necesitas tener instalado **Docker** y **Docker Compose**:

- **Docker Desktop**: https://www.docker.com/products/docker-desktop
  - Para macOS, Windows, o Linux

## Ventajas de usar Docker

✅ **Mismo ambiente en todas las máquinas** - Node, pnpm, y todas las dependencias vienen en el contenedor  
✅ **No necesitas instalar Node ni pnpm** en tu máquina local  
✅ **Hot reload funciona** - Los cambios se reflejan automáticamente  
✅ **Fácil de compartir** - Cualquier persona con Docker puede correr el proyecto  

## Inicio Rápido

### 1. Instalar Docker Desktop

Descarga e instala Docker Desktop para tu sistema operativo:
- macOS: https://docs.docker.com/desktop/install/mac-install/
- Windows: https://docs.docker.com/desktop/install/windows-install/
- Linux: https://docs.docker.com/desktop/install/linux-install/

### 2. Verificar instalación

```bash
docker --version
docker-compose --version
```

### 3. Clonar el repositorio

```bash
git clone https://github.com/cristiancruzkai/KAI-SAAS.git
cd KAI-SAAS
```

### 4. Ejecutar con Docker Compose

**Para ejecutar solo el Dashboard:**
```bash
docker-compose up dashboard
```

**Para ejecutar todos los servicios (dashboard, web, docs):**
```bash
docker-compose up
```

**Para ejecutar en segundo plano (detached mode):**
```bash
docker-compose up -d
```

### 5. Acceder a las aplicaciones

- **Dashboard**: http://localhost:3002
- **Web**: http://localhost:3000 (si ejecutaste todos los servicios)
- **Docs**: http://localhost:3001 (si ejecutaste todos los servicios)

## Comandos Útiles

### Ver logs en tiempo real
```bash
docker-compose logs -f dashboard
```

### Detener los contenedores
```bash
docker-compose down
```

### Reconstruir contenedores (después de cambios en dependencias)
```bash
docker-compose up --build
```

### Entrar al contenedor para debugging
```bash
docker exec -it kai-saas-dashboard sh
```

### Limpiar todo (contenedores, imágenes, volúmenes)
```bash
docker-compose down -v
docker system prune -a
```

## Desarrollo

### Hot Reload

Los cambios en el código se detectan automáticamente gracias a los volúmenes montados. Solo guarda el archivo y el navegador se recargará.

### Instalar nuevas dependencias

Si necesitas instalar una nueva dependencia:

1. **Opción A: Desde el contenedor**
   ```bash
   docker exec -it kai-saas-dashboard sh
   pnpm add <paquete> --filter dashboard
   exit
   ```

2. **Opción B: Reconstruir la imagen**
   ```bash
   # Edita package.json manualmente
   docker-compose up --build dashboard
   ```

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# .env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Producción

Para crear una imagen de producción:

```bash
# Crear imagen optimizada
docker build -t kai-saas-dashboard:production -f app/Dockerfile.prod app/

# Ejecutar en producción
docker run -p 3002:3002 kai-saas-dashboard:production
```

## Solución de Problemas

### El puerto ya está en uso
```bash
# Cambiar el puerto en docker-compose.yml
ports:
  - "3003:3002"  # Usar 3003 en lugar de 3002
```

### Los cambios no se reflejan
```bash
# Reconstruir contenedores
docker-compose down
docker-compose up --build
```

### Error de permisos en Linux
```bash
# Ejecutar con sudo o agregar tu usuario al grupo docker
sudo usermod -aG docker $USER
# Luego cerrar sesión y volver a entrar
```

### Limpiar cache y empezar de cero
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Comparación: Docker vs Setup Manual

| Aspecto | Docker | Setup Manual |
|---------|--------|--------------|
| Instalación Node/pnpm | ❌ No necesario | ✅ Requerido |
| Versiones consistentes | ✅ Garantizado | ⚠️ Puede variar |
| Setup inicial | 5 minutos | 15-30 minutos |
| Compatibilidad | ✅ Todas las plataformas | ⚠️ Puede variar |
| Debugging | ⚠️ Un poco más complejo | ✅ Directo |
| Performance | ⚠️ Ligera sobrecarga | ✅ Nativo |

## Recomendación

- **Desarrollo en equipo**: Usa Docker - todos tendrán el mismo ambiente
- **Desarrollo individual**: Puedes usar cualquiera, pero Docker es más fácil de configurar
- **CI/CD**: Docker es esencial para pipelines consistentes

## Soporte

Si tienes problemas con Docker:
1. Verifica que Docker Desktop esté corriendo
2. Revisa los logs: `docker-compose logs -f`
3. Intenta reconstruir: `docker-compose up --build`
4. Limpia todo: `docker-compose down -v && docker system prune -a`
