# Backend

This is the backend for the suit-app.

## Environment Configuration

This project uses `.env` files for environment variable management. There are two main files for configuration:

- `.env.development`: For local development.
- `.env.production`: For the production environment.

During testing, both `.env.development` and `.env.production` files contain identical environment variables, pointing to the external Supabase database. This setup allows for consistent testing across development and production-like environments.

The application automatically loads variables from the appropriate file based on the `NODE_ENV` environment variable.

**Setup:**

1.  Ensure both `.env.development` and `.env.production` files exist in the `backend` directory and contain the necessary environment variables for connecting to the Supabase database.
2.  For actual production deployment, you will update the `.env.production` file with the URLs of your newly provisioned production machines.

## Getting Started

1.  Install dependencies: `npm install`
2.  Ensure your Docker is running and the PostgreSQL container is up.
3.  Run migrations: `npx prisma migrate dev`
4.  (Optional) Seed the database with initial data: `npm run seed`

## Running the Application

### Development Mode

To start the server in development mode (with hot-reloading), run:

```bash
npm run dev
```

This will use the variables from `.env.development`.

### Production Mode

To start the server in production mode, run:

```bash
npm run build
npm start
```

This will first build the TypeScript source into JavaScript, and then start the server using the variables from `.env.production`. Make sure you have `NODE_ENV=production` set in your production environment.

## Test Importer User

For testing purposes, a default user is created by the seeding script.

- **Email:** `test-importer@example.com`
- **Password:** `password123`

Restart-Service -Name "hns" -Force
Command to use on windows in case port 3000 blocekd
