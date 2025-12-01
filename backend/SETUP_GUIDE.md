# 🚀 Guía de Configuración y Deploy

## 📋 Paso 1: Configurar .firebaserc

Edita el archivo `backend/.firebaserc` y reemplaza con tus IDs de proyecto reales:

```json
{
  "projects": {
    "testing": "tu-proyecto-testing-id",
    "production": "tu-proyecto-produccion-id"
  }
}
```

**¿Cómo obtener los IDs de proyecto?**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** (⚙️ > Project settings)
4. Copia el **Project ID**

---

## 📋 Paso 2: Configurar Variables de Entorno

### Para Testing:

Edita `backend/functions/.env.testing`:

```bash
ENVIRONMENT=testing
FIREBASE_PROJECT_ID=tu-proyecto-testing-id
APP_NAME=KAI-SAAS-Testing
APP_URL=https://tu-dominio-testing.web.app
ALLOWED_ORIGINS=http://localhost:3000,https://tu-dominio-testing.web.app
```

### Para Production:

Edita `backend/functions/.env.production`:

```bash
ENVIRONMENT=production
FIREBASE_PROJECT_ID=tu-proyecto-produccion-id
APP_NAME=KAI-SAAS
APP_URL=https://tu-dominio-produccion.web.app
ALLOWED_ORIGINS=https://tu-dominio-produccion.web.app
```

---

## 📋 Paso 3: Instalar Dependencias

```bash
cd backend/functions
npm install
```

Asegúrate de tener estas dependencias en `package.json`:

```json
{
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^5.0.0"
  }
}
```

---

## 🚀 Paso 4: Deploy a Testing

```bash
# Desde la carpeta backend/
cd backend

# Seleccionar proyecto de testing
firebase use testing

# Deploy de todas las funciones
firebase deploy --only functions
```

**Funciones que se desplegarán:**
- ✅ `getAgentsByUserId`
- ✅ `getAgentById`
- ✅ `updateAgent`

---

## 🧪 Paso 5: Probar las APIs

Después del deploy, obtendrás las URLs de tus funciones:

```
✔  functions[getAgentsByUserId(us-central1)]
   https://us-central1-TU-PROYECTO-TESTING.cloudfunctions.net/getAgentsByUserId

✔  functions[getAgentById(us-central1)]
   https://us-central1-TU-PROYECTO-TESTING.cloudfunctions.net/getAgentById

✔  functions[updateAgent(us-central1)]
   https://us-central1-TU-PROYECTO-TESTING.cloudfunctions.net/updateAgent
```

### Probar con curl:

```bash
# 1. Obtener agentes de un usuario
curl "https://us-central1-TU-PROYECTO-TESTING.cloudfunctions.net/getAgentsByUserId?userId=USER123"

# 2. Obtener un agente específico
curl "https://us-central1-TU-PROYECTO-TESTING.cloudfunctions.net/getAgentById?id=AGENT123"

# 3. Actualizar un agente
curl -X PUT "https://us-central1-TU-PROYECTO-TESTING.cloudfunctions.net/updateAgent?id=AGENT123" \
  -H "Content-Type: application/json" \
  -d '{"name": "Nuevo nombre", "status": "active"}'
```

---

## 🔄 Deploy Individual (Actualizar solo una función)

```bash
# Deploy solo de una función
firebase deploy --only functions:getAgentById

# Deploy de varias funciones específicas
firebase deploy --only functions:getAgentById,functions:updateAgent
```

---

## 📊 Ver Logs

```bash
# Ver logs de todas las funciones
firebase functions:log

# Ver logs de una función específica
firebase functions:log --only getAgentById

# Ver logs en tiempo real
firebase functions:log --follow
```

---

## 🌐 Deploy a Production

Cuando todo funcione en testing:

```bash
# Cambiar a proyecto de producción
firebase use production

# Deploy a producción
firebase deploy --only functions
```

---

## 🔧 Comandos Útiles

```bash
# Ver qué proyecto estás usando actualmente
firebase use

# Listar todos los proyectos configurados
firebase projects:list

# Ver todas las funciones desplegadas
firebase functions:list

# Eliminar una función
firebase functions:delete nombreFuncion
```

---

## ⚠️ Importante

1. **NO subas archivos `.env` a Git**
   - Los archivos `.env.testing` y `.env.production` en el repo son plantillas
   - Crea copias locales con tus credenciales reales
   - Asegúrate de que `.env` esté en `.gitignore`

2. **Estructura de datos en Firestore**
   - Los agentes deben tener un campo `userId` para que `getAgentsByUserId` funcione
   - Ejemplo de documento en `kai_agents`:
     ```json
     {
       "name": "Mi Agente",
       "userId": "USER123",
       "status": "active",
       "createdAt": "timestamp",
       "updatedAt": "timestamp"
     }
     ```

3. **CORS**
   - Actualiza `ALLOWED_ORIGINS` con tus dominios reales
   - En desarrollo usa `http://localhost:3000` o el puerto que uses

---

## 🐛 Troubleshooting

### Error: "Firebase project not found"
```bash
firebase login
firebase projects:list
firebase use --add
```

### Error: "Permission denied"
```bash
firebase login --reauth
```

### Error: "Function deployment failed"
```bash
# Ver logs detallados
firebase deploy --only functions --debug
```

### Las funciones no aparecen
```bash
# Verificar que index.js exporta las funciones
cat functions/index.js

# Verificar sintaxis
cd functions
npm run lint
```
