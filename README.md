# NestJS REST API Project

REST API service built with NestJS framework that includes authentication, CRUD operations, and data caching
capabilities.

## Tech Stack

- **Backend Framework:** NestJS
- **Database:** PostgreSQL with TypeORM
- **Caching:** Redis
- **Documentation:** Swagger

## Features

- User authentication and authorization
- CRUD operations for resources
- Data caching with Redis
- API documentation with Swagger
- Database migrations with TypeORM

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm
- PostgreSQL
- Redis

### Installation

1. Clone the repository:

```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:

```bash
   npm install
   ```

3. Configure environment variables

- Copy the example environment file to create your own:

```bash
   cp .env.sample .env
   ```

- Edit the .env file with your specific configuration values

4. Run database migrations:

```bash
   npm run typeorm:run-migrations
   ```

5. Start the application:

```bash
   npm run start
   ```

- For development mode with hot-reload:

```bash
   npm run start:dev
   ```

## API Documentation

The API is documented using Swagger. After starting the application, you can access the documentation at:

```
http://localhost:3001/api/docs
```

## Available Endpoints

The API provides endpoints for:

- User registration and authentication
- Resource management (create, read, update, delete)
- Data retrieval with filtering and pagination

## Database Migrations

To create a new migration after schema changes:

```bash
   npm run typeorm:generate-migration -- src/migrations/<MigrationName>
   ```

To revert migrations

```bash
   npm run typeorm:revert-migration
   ```

## Testing

Run tests with:

```bash
# Unit tests
npm run test
   ```