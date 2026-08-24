# Thrainax Shop — Spring Boot Backend

Java 17 + Spring Boot 3 + Spring Data JPA + MySQL + JWT security.
Layering: Controller → Service → Repository, with DTOs mirroring the React REST contract in `src/lib/api.ts`.

## Prerequisites

- JDK 17+
- Maven 3.9+
- MySQL 8 running locally

## Configure

`src/main/resources/application.properties` (defaults shown):

```
spring.datasource.url=jdbc:mysql://localhost:3306/thrainax_shop?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
app.jwt.secret=change-this-to-a-long-random-secret-at-least-32-bytes-long
app.cors.allowed-origins=http://localhost:5173,http://localhost:8080,http://localhost:3000
```

## Run

```bash
cd backend
mvn spring-boot:run
```

API base URL: `http://localhost:8080/api`

## Connect the React frontend

Create `.env` at the project root:

```
VITE_API_URL=http://localhost:8080/api
```

Without this variable, the frontend runs on its browser-local mock layer (same contract) so the preview works without Java.

## Seeded accounts

| Role  | Email                 | Password |
| ----- | --------------------- | -------- |
| ADMIN | admin@thrainax.com    | admin123 |
| USER  | user@thrainax.com     | user123  |

The 8 demo products from the preview are seeded on first start.

## Endpoints

Public

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`, `GET /api/products/{id}`

Authenticated (send `Authorization: Bearer <token>`)

- `GET /api/auth/me`
- `GET /api/cart`
- `POST /api/cart/items` `{ productId, quantity }`
- `PUT /api/cart/items/{itemId}` `{ quantity }`
- `DELETE /api/cart/items/{itemId}`
- `POST /api/orders` `{ address, phone }`
- `GET /api/orders`, `GET /api/orders/{id}`

Admin only (`ROLE_ADMIN`)

- `POST /api/admin/products`, `PUT /api/admin/products/{id}`, `DELETE /api/admin/products/{id}`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/{id}/status` `{ status }`

Errors return `{ "message": "..." }` with the appropriate HTTP status.
