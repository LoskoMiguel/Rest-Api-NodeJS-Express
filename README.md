# Sistema de Restaurante Express

Sistema de gestión para restaurantes desarrollado con Node.js y Express, que permite la administración de pedidos, mesas y personal del restaurante.

## 📋 Características

### Gestión de Usuarios y Autenticación
- Sistema de login con JWT
- Registro de usuarios por el administrador
- Roles específicos: mesero, cocinero, administrador

### Sistema de Pedidos
- Creación de nuevos pedidos por mesa
- Actualización de pedidos existentes
- Identificación de pedidos por ID

### Panel de Cocinero
- Visualización de pedidos pendientes
- Marcado de platos como listos
- Gestión de pedidos por ID

### Panel de Administrador
- Gestión de mesas
- Gestión de productos
- Registro de nuevos usuarios

## 🛠️ Tecnologías y Dependencias

### Principales:
- Node.js
- Express.js (^4.21.2)
- Better-SQLite3 (^11.8.1)
- JSON Web Tokens (^9.0.2)

### Seguridad:
- bcrypt (^5.1.1) - Encriptación de contraseñas

### Desarrollo:
- nodemon (^3.1.9) - Reinicio automático del servidor

## 📌 Endpoints API

### Autenticación
- POST `/login` - Iniciar sesión

### Meseros
- POST `/new_order` - Crear nuevo pedido
- PUT `/update_order` - Actualizar pedido por mesa y plato
- PUT `/update_order_id` - Actualizar pedido por ID
- DELETE `/delete_order` - Eliminar pedido

### Cocineros
- PUT `/dish_ready` - Marcar plato como listo
- PUT `/dish_ready_id` - Marcar plato como listo por ID

### Visualización
- GET `/show_pending_dishes` - Ver platos pendientes
- GET `/show_ready_dishes` - Ver platos listos
- GET `/show_product` - Ver productos disponibles
- GET `/dashboard` - Panel principal

### Administrador
- POST `/admin/register` - Registrar nuevo usuario
- Rutas de gestión de mesas y productos

## 📦 Estructura del Proyecto

```
sistema_restaurante_express/
├── server.js
├── db/
│   └── conexion.js
├── routes/
│   ├── login.js
│   ├── dashboard.js
│   ├── show_pending_dishes.js
│   ├── show_ready_dishes.js
│   ├── show_product.js
│   ├── mesero/
│   │   ├── new_order.js
│   │   ├── update_order.js
│   │   ├── update_order_id.js
│   │   └── delete_order.js
│   ├── cocinero/
│   │   ├── dish_ready.js
│   │   └── dish_ready_id.js
│   └── admin/
│       ├── register.js
│       ├── mesas/
│       └── productos/
├── postman/
│   └── RestauranteApi.postman_collection.json
├── package.json
└── package-lock.json
```

## 🔐 Variables de Entorno Necesarias

```env
JWT_SECRET=tu_clave_secreta
```

## 👥 Roles y Funcionalidades

### Mesero
- Crear nuevos pedidos
- Actualizar pedidos existentes
- Ver estado de pedidos

### Cocinero
- Ver lista de pedidos pendientes
- Marcar platos como listos
- Gestionar pedidos por ID

### Administrador
- Gestión de usuarios
- Gestión de mesas
- Gestión de productos

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm start` - Inicia el servidor

## 📞 Soporte

Para reportar problemas o sugerir mejoras, por favor crear un issue en el repositorio.

## 👤 Autor

- **Losko**