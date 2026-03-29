## NebulaCore API Nexus

Production-ready full-stack project.

### Tech Stack
- Backend: Node.js + Express
- DB: Supabase (PostgreSQL) via Supabase JS
- Auth: JWT (access + refresh)
- Validation: Zod
- Docs: Swagger at `/api-docs`
- Frontend: Next.js + Tailwind CSS
- Logging: Winston
- Security: Helmet, HPP, Rate limiting, Sanitization

### Project Structure
```
root/
  backend/
  frontend/
```

### Environment Variables
Create a `.env` in `backend/`:
- `PORT=4000`
- `NODE_ENV=development`
- `JWT_ACCESS_SECRET=...`
- `JWT_REFRESH_SECRET=...`
- `JWT_ACCESS_EXPIRES=15m`
- `JWT_REFRESH_EXPIRES=7d`
- `SUPABASE_URL=https://YOUR_PROJECT.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY`
- `SWAGGER_TITLE=NebulaCore API Nexus`
- `SWAGGER_VERSION=1.0.0`
- `SWAGGER_DESCRIPTION=NebulaCore API Nexus - Swagger API documentation`
- `RATE_LIMIT_WINDOW_MS=60000`
- `RATE_LIMIT_MAX=100`

Create a `.env.local` in `frontend/`:
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1`

### Supabase Setup
1) Create a new Supabase project.
2) Get `SUPABASE_URL` and `service_role` key from Settings → API.
3) SQL for tables (SQL Editor):
```sql
create table if not exists public.users (
  id uuid primary key,
  email text unique not null,
  password text not null,
  role text not null default 'user',
  created_at timestamp with time zone default now()
);

create table if not exists public.tasks (
  id uuid primary key,
  title text not null,
  description text default '',
  status text not null default 'todo',
  user_id uuid not null references public.users (id) on delete cascade,
  created_at timestamp with time zone default now()
);
```
4) Ensure RLS is OFF for simplicity in this template (or write appropriate policies if you enable RLS).

### Backend: Run
```
cd backend
npm install
npm run dev
```
Swagger UI: `http://localhost:4000/api-docs`

### Frontend: Run
```
cd frontend
npm install
npm run dev
```
Visit: `http://localhost:3000`

### Auth Flow
- Register: `POST /api/v1/auth/register`
- Login: `POST /api/v1/auth/login` → returns `accessToken`, `refreshToken`, and `user`
- Refresh: `POST /api/v1/auth/refresh` with `refreshToken`
- Frontend stores tokens in `localStorage` and uses them for API calls

### Tasks API (v1)
- Create: `POST /api/v1/tasks`
- List: `GET /api/v1/tasks?search=&status=&page=&limit=`
- Get by id: `GET /api/v1/tasks/:id`
- Update: `PATCH /api/v1/tasks/:id`
- Delete: `DELETE /api/v1/tasks/:id`
Admin sees all tasks; normal users see their own.

### Security Notes
- Passwords: hashed using bcrypt.
- JWT: short-lived access tokens, refresh tokens to rotate.
- Middlewares: helmet, hpp, rate limiting.
- Sanitization: sanitize-html for user inputs persisted to DB.

### Docker (backend)
```
cd backend
docker build -t nebulacore-backend .
docker run -p 4000:4000 --env-file .env nebulacore-backend
```

### Scalability Notes
- Microservices: Split services (auth, tasks) into separate services with clear contracts (REST/gRPC). Centralized auth can issue tokens; services verify JWTs.
- Caching: Introduce Redis to cache frequent reads (e.g., task lists by user, pagination pages). Invalidate on writes.
- Load Balancing: Run multiple backend instances behind a load balancer (NGINX/Cloud LB). Sticky sessions not required due to stateless JWT auth. Horizontal scale both API and frontend.

### Bonus
- Pagination and search implemented on `GET /tasks`.
- Refresh tokens implemented.

