# 📚 KAI-SAAS API Documentation

Documentación completa de las Cloud Functions para el panel de administración de agentes.

## 🌐 Base URL

```
https://us-central1-asistente-comercial-8d43c.cloudfunctions.net
```

---

## 🔑 Autenticación

Las APIs de autenticación utilizan **Firebase Auth** con tokens JWT Bearer.

### Flujo de Autenticación

1. **Login** → Obtener token JWT
2. **Usar token** en header `Authorization: Bearer <token>` para APIs protegidas
3. **Token expira** en 1 hora → Hacer login de nuevo o usar refresh token

---

## 📋 APIs Disponibles

### 🔐 Authentication APIs

#### 1. **Login**

Autentica un usuario y retorna un token JWT.

**Endpoint:** `POST /login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Login successful",
    "user": {
      "uid": "abc123...",
      "email": "usuario@example.com",
      "displayName": "Usuario Test",
      "emailVerified": true
    },
    "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...",
    "refreshToken": "AOEOulZ...",
    "expiresIn": "3600"
  },
  "timestamp": "2025-12-04T16:00:00.000Z"
}
```

**Errores:**
- `401` - Email o contraseña incorrectos
- `400` - Email o password faltantes
- `500` - Error de configuración del servidor

---

#### 2. **Get User Profile** 🔒

Obtiene el perfil del usuario autenticado.

**Endpoint:** `GET /getUserProfile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "uid": "abc123...",
    "email": "usuario@example.com",
    "emailVerified": true,
    "displayName": "Usuario Test",
    "photoURL": "https://...",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "lastSignIn": "2025-12-04T16:00:00.000Z"
  },
  "timestamp": "2025-12-04T16:00:00.000Z"
}
```

**Errores:**
- `401` - Token inválido o expirado
- `401` - No se proporcionó token

---

#### 3. **Update Password** 🔒

Cambia la contraseña del usuario autenticado.

**Endpoint:** `POST /updatePassword`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "newPassword": "nuevaPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password updated successfully",
    "uid": "abc123..."
  },
  "timestamp": "2025-12-04T16:00:00.000Z"
}
```

**Errores:**
- `400` - Contraseña muy corta (mínimo 6 caracteres)
- `401` - Token inválido

---

#### 4. **Update Email** 🔒

Cambia el email del usuario autenticado.

**Endpoint:** `POST /updateEmail`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "newEmail": "nuevo@email.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Email updated successfully. Please verify your new email.",
    "uid": "abc123...",
    "newEmail": "nuevo@email.com",
    "emailVerified": false
  },
  "timestamp": "2025-12-04T16:00:00.000Z"
}
```

**Errores:**
- `400` - Email ya en uso
- `400` - Formato de email inválido
- `401` - Token inválido

---

#### 5. **Update Profile** 🔒

Actualiza datos del perfil del usuario.

**Endpoint:** `PUT /updateProfile`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "displayName": "Nuevo Nombre",
  "photoURL": "https://example.com/photo.jpg",
  "phoneNumber": "+1234567890"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "uid": "abc123...",
    "email": "usuario@example.com",
    "displayName": "Nuevo Nombre",
    "photoURL": "https://example.com/photo.jpg",
    "phoneNumber": "+1234567890",
    "updatedAt": "2025-12-04T16:00:00.000Z"
  },
  "timestamp": "2025-12-04T16:00:00.000Z"
}
```

---

### 🤖 Agent Management APIs

### 1. **Get Agents By User ID**

Obtiene todos los agentes de un usuario.

**Endpoint:** `GET /getAgentsByUserId`

**Parámetros:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `userId` | string | ✅ | ID del usuario propietario |

**Ejemplo de Request:**
```bash
GET https://us-central1-asistente-comercial-8d43c.cloudfunctions.net/getAgentsByUserId?userId=q5ia05np1XNIGQr6KaigStsb0Fs1
```

**Ejemplo de Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "q5ia05np1XNIGQr6KaigStsb0Fs1",
    "agents": [
      {
        "id": "3b01d3b2-742e-4d80-85ff-8613eae9abc6",
        "name": "Agente de Ventas",
        "status": "active",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 1
  }
}
```

---

### 2. **Get Agent By ID**

Obtiene un agente específico con sus colecciones.

**Endpoint:** `GET /getAgentById`

**Parámetros:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | ✅ | ID del agente |

**Ejemplo de Request:**
```bash
GET https://us-central1-asistente-comercial-8d43c.cloudfunctions.net/getAgentById?id=3b01d3b2-742e-4d80-85ff-8613eae9abc6
```

**Ejemplo de Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "3b01d3b2-742e-4d80-85ff-8613eae9abc6",
    "name": "Agente de Ventas",
    "description": "Agente para atención al cliente",
    "status": "active",
    "collections": [
      "chats",
      "knowledgeBase",
      "modifications",
      "properties",
      "sheets",
      "tools",
      "users"
    ]
  }
}
```

---

### 3. **Get Collection By Agent ID** 🔒

Obtiene documentos de una colección específica de un agente.

**Endpoint:** `GET /getCollectionByAgentId`

**Seguridad:** Valida que el agente pertenezca al usuario.

**Parámetros:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `userId` | string | ✅ | ID del usuario (usa `"testid"` para testing) |
| `agentId` | string | ✅ | ID del agente |
| `collectionName` | string | ✅ | Nombre de la colección |

**Colecciones disponibles:**
- `chats`
- `knowledgeBase`
- `modifications`
- `properties`
- `sheets`
- `tools`
- `users`

**Ejemplo de Request (Modo Normal):**
```bash
GET https://us-central1-asistente-comercial-8d43c.cloudfunctions.net/getCollectionByAgentId?userId=q5ia05np1XNIGQr6KaigStsb0Fs1&agentId=3b01d3b2-742e-4d80-85ff-8613eae9abc6&collectionName=knowledgeBase
```

**Ejemplo de Request (Modo Test):**
```bash
GET https://us-central1-asistente-comercial-8d43c.cloudfunctions.net/getCollectionByAgentId?userId=testid&agentId=3b01d3b2-742e-4d80-85ff-8613eae9abc6&collectionName=knowledgeBase
```

**Ejemplo de Response (200 - Con documentos):**
```json
{
  "success": true,
  "data": {
    "userId": "q5ia05np1XNIGQr6KaigStsb0Fs1",
    "agentId": "3b01d3b2-742e-4d80-85ff-8613eae9abc6",
    "collectionName": "knowledgeBase",
    "documents": [
      {
        "id": "doc1",
        "title": "Información del producto",
        "content": "Detalles sobre el producto...",
        "tags": ["producto", "info"]
      },
      {
        "id": "doc2",
        "title": "Preguntas frecuentes",
        "content": "FAQ del servicio..."
      }
    ],
    "total": 2,
    "path": "agent_configurations/3b01d3b2-742e-4d80-85ff-8613eae9abc6/knowledgeBase"
  }
}
```

**Ejemplo de Response (200 - Colección vacía):**
```json
{
  "success": true,
  "data": {
    "userId": "testid",
    "agentId": "3b01d3b2-742e-4d80-85ff-8613eae9abc6",
    "collectionName": "chats",
    "documents": [],
    "total": 0,
    "message": "La colección \"chats\" no tiene documentos",
    "availableCollections": ["knowledgeBase", "tools", "users"]
  }
}
```

**Ejemplo de Response (403 - Acceso denegado):**
```json
{
  "success": false,
  "error": "Access denied: Agent does not belong to this user"
}
```

---

### 4. **Update Agent**

Actualiza los campos de un agente.

**Endpoint:** `POST /updateAgent`

**Content-Type:** `application/json`

**Body:**
```json
{
  "agentId": "3b01d3b2-742e-4d80-85ff-8613eae9abc6",
  "updates": {
    "name": "Nuevo nombre del agente",
    "description": "Nueva descripción",
    "status": "active"
  }
}
```

**Ejemplo de Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Agent updated successfully"
  }
}
```

---

## 🚨 Códigos de Error

| Código | Descripción |
|--------|-------------|
| `400` | Bad Request - Parámetros faltantes o inválidos |
| `401` | Unauthorized - Token inválido, expirado o no proporcionado |
| `403` | Forbidden - Acceso denegado (el agente no pertenece al usuario) |
| `404` | Not Found - Recurso no encontrado |
| `405` | Method Not Allowed - Método HTTP no permitido |
| `500` | Internal Server Error - Error del servidor |

**Formato de error:**
```json
{
  "success": false,
  "error": {
    "message": "Mensaje de error descriptivo",
    "code": 401
  },
  "timestamp": "2025-12-04T16:00:00.000Z"
}
```

**Errores de validación:**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": 400,
    "validationErrors": [
      {
        "field": "newPassword",
        "message": "Password must be at least 6 characters"
      }
    ]
  },
  "timestamp": "2025-12-04T16:00:00.000Z"
}
```

---

## 🧪 Testing

### Modo Test (Development)

Para probar sin validación de seguridad, usa `userId=testid`:

```bash
# Ejemplo
GET /getCollectionByAgentId?userId=testid&agentId=CUALQUIER-ID&collectionName=knowledgeBase
```

> ⚠️ **Importante:** Eliminar el modo test antes de producción.

### Postman Collection

Puedes importar la especificación OpenAPI en Postman:
1. Abre Postman
2. Import → Upload Files
3. Selecciona `api-documentation.yaml`
4. Postman generará automáticamente todas las requests

---

## 📊 Ejemplos de Uso en Frontend

### JavaScript/TypeScript

```javascript
// Obtener agentes de un usuario
async function getAgentsByUserId(userId) {
  const response = await fetch(
    `https://us-central1-asistente-comercial-8d43c.cloudfunctions.net/getAgentsByUserId?userId=${userId}`
  );
  const data = await response.json();
  
  if (data.success) {
    return data.data.agents;
  } else {
    throw new Error(data.error);
  }
}

// Obtener colección de un agente
async function getAgentCollection(userId, agentId, collectionName) {
  const url = new URL('https://us-central1-asistente-comercial-8d43c.cloudfunctions.net/getCollectionByAgentId');
  url.searchParams.append('userId', userId);
  url.searchParams.append('agentId', agentId);
  url.searchParams.append('collectionName', collectionName);
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.success) {
    return data.data.documents;
  } else {
    throw new Error(data.error);
  }
}

// Actualizar agente
async function updateAgent(agentId, updates) {
  const response = await fetch(
    'https://us-central1-asistente-comercial-8d43c.cloudfunctions.net/updateAgent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId,
        updates
      })
    }
  );
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error);
  }
  
  return data;
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

function useAgentCollection(userId: string, agentId: string, collectionName: string) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCollection() {
      try {
        setLoading(true);
        const url = new URL('https://us-central1-asistente-comercial-8d43c.cloudfunctions.net/getCollectionByAgentId');
        url.searchParams.append('userId', userId);
        url.searchParams.append('agentId', agentId);
        url.searchParams.append('collectionName', collectionName);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setDocuments(data.data.documents);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCollection();
  }, [userId, agentId, collectionName]);

  return { documents, loading, error };
}
```

---

## 🔗 Recursos Adicionales

- **OpenAPI Spec:** `docs/api-documentation.yaml`
- **Swagger Editor:** https://editor.swagger.io/ (pega el contenido del YAML)
- **Firebase Console:** https://console.firebase.google.com/project/asistente-comercial-8d43c/functions

---

## 📝 Notas para Producción

1. **✅ Firebase Authentication Implementada**
   - Login con email/password
   - Tokens JWT con expiración de 1 hora
   - Middleware de autenticación en APIs protegidas

2. **Configurar API Key**
   - Ejecutar: `firebase functions:config:set auth.apikey="TU_WEB_API_KEY"`
   - Obtener de Firebase Console → Project Settings → Web API Key

3. **Eliminar modo test**
   - Remover la condición `userId === "testid"` en `getCollectionByAgentId`

4. **CORS restrictivo**
   - Actualizar `ALLOWED_ORIGINS` en `.env.production`
   - Limitar a tu dominio específico en producción

5. **Rate Limiting**
   - Considerar implementar límites de requests por usuario
   - Firebase Functions tiene límites por defecto

6. **Logging y Monitoring**
   - Configurar alertas en Firebase Console
   - Monitorear errores 401, 403 y 500
   - Revisar logs de login fallidos

7. **Verificación de Email**
   - Configurar plantillas de email en Firebase Console
   - Personalizar con tu branding

---

**Última actualización:** 2025-12-04
