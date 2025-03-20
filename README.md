# README

## Descripción del Proyecto
LamineIA es API REST que implementa la API de ChatGPT para realizar consultas, gestiona usuarios y almacenar registros de chats con la inteligencia artificial. Está desarrollado en Node.js y utiliza MongoDB como base de datos.

## Características
- Integración con la API de ChatGPT.
- Registro y gestión de usuarios.
- Almacenamiento de logs de conversaciones.
- Desarrollado con Node.js y MongoDB.

## Instalación
1. Clona el repositorio.
2. Instala las dependencias con `npm install`.
3. Configura las variables de entorno.
4. Inicia el servidor con `npm start`.

## Uso
Realiza consultas a la API de ChatGPT y gestiona usuarios a través de las rutas definidas en el servicio.

## Ejemplo de Uso
```javascript
const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: '¿Cuál es la capital de Francia?' }),
});
const data = await response.json();
console.log(data);
```

## Tecnologías Utilizadas
- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework para construir aplicaciones web en Node.js.
- **MongoDB**: Base de datos NoSQL para almacenar datos de usuarios y logs de chat.
- **Mongoose**: Biblioteca para modelar datos en MongoDB.

## Rutas API
- `POST /api/chat`: Envía una consulta a la API de ChatGPT.
- `POST /api/users`: Registra un nuevo usuario.
- `GET /api/users/:id`: Obtiene información de un usuario específico.
- `GET /api/logs`: Recupera el historial de chats.

## Contacto
Para más información, contacta a [ingdiazjc@gmail.com].

## Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request.

## Licencia
Este proyecto está bajo la Licencia MIT. # README
