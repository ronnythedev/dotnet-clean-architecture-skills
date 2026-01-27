# Point of Sale API

A clean architecture Point of Sale system built with .NET 10, Entity Framework Core, and PostgreSQL.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with the following layers:

```
├── src/
│   ├── pointofsale.domain/          # Core entities, interfaces, domain events
│   ├── pointofsale.application/     # CQRS handlers, validators, business logic
│   ├── pointofsale.infrastructure/  # EF Core, repositories, external services
│   └── pointofsale.api/             # Controllers, middleware, configuration
```

## 🚀 Quick Start with Docker

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run the Application

1. **Clone the repository** and navigate to the project folder:
   ```bash
   cd Test
   ```

2. **Start all services** using Docker Compose:
   ```bash
   docker compose -f src/pointofsale.api/docker-compose.yml up -d
   ```

3. **Apply database migrations** (first time only):
   ```bash
   docker compose -f src/pointofsale.api/docker-compose.yml exec webapi dotnet ef database update
   ```
   
   Or if running locally with .NET SDK:
   ```bash
   dotnet ef database update --project src/pointofsale.infrastructure --startup-project src/pointofsale.api
   ```

4. **Access the application**:
   - 🌐 **Swagger UI**: http://localhost:5100/swagger
   - ❤️ **Health Check**: http://localhost:5100/health
   - 🐘 **pgAdmin**: http://localhost:5050
     - Email: `admin@pointofsale.com`
     - Password: `admin`

### Stop the Application

```bash
docker compose -f src/pointofsale.api/docker-compose.yml down
```

### Rebuild After Code Changes

```bash
docker compose -f src/pointofsale.api/docker-compose.yml up --build -d
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products |
| `POST` | `/api/products` | Create a new product |
| `GET` | `/api/categories` | List all categories |
| `POST` | `/api/categories` | Create a new category |
| `GET` | `/api/customers` | List all customers |
| `POST` | `/api/customers` | Create a new customer |
| `GET` | `/api/sales/{id}` | Get sale by ID |
| `POST` | `/api/sales` | Create a new sale |
| `GET` | `/health` | Health check endpoint |

## 🐳 Docker Services

| Service | Container Name | Port | Description |
|---------|----------------|------|-------------|
| Web API | pointofsale-api | 5100 | .NET 10 REST API |
| PostgreSQL | pointofsale-db | 5432 | Database server |
| pgAdmin | pointofsale-pgadmin | 5050 | Database admin UI |

## 🛠️ Development Setup

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Run Locally (without Docker for API)

1. **Start database only**:
   ```bash
   docker compose -f src/pointofsale.api/docker-compose.yml up postgres -d
   ```

2. **Apply migrations**:
   ```bash
   dotnet ef database update --project src/pointofsale.infrastructure --startup-project src/pointofsale.api
   ```

3. **Run the API**:
   ```bash
   dotnet run --project src/pointofsale.api
   ```

### Create New Migration

```bash
dotnet ef migrations add <MigrationName> --project src/pointofsale.infrastructure --startup-project src/pointofsale.api
```

## 📁 Project Structure

```
├── src/
│   ├── pointofsale.domain/
│   │   ├── Abstractions/        # Base classes (Entity, Result, IUnitOfWork)
│   │   ├── Products/            # Product entity and repository interface
│   │   ├── Categories/          # Category entity and repository interface
│   │   ├── Customers/           # Customer entity and repository interface
│   │   └── Sales/               # Sale, SaleItem entities and interfaces
│   │
│   ├── pointofsale.application/
│   │   ├── Abstractions/        # CQRS interfaces, service contracts
│   │   ├── Behaviors/           # Pipeline behaviors (logging, validation)
│   │   └── Sales/               # Commands, queries, handlers for sales
│   │
│   ├── pointofsale.infrastructure/
│   │   ├── Configurations/      # EF Core entity configurations
│   │   ├── Migrations/          # Database migrations
│   │   ├── Repositories/        # Repository implementations
│   │   └── Data/                # DbContext, connection factory
│   │
│   └── pointofsale.api/
│       ├── Controllers/         # API controllers
│       ├── Properties/          # Launch settings
│       ├── Dockerfile           # Container build instructions
│       └── docker-compose.yml   # Multi-container orchestration
│
├── .dockerignore
├── PointOfSale.sln
└── README.md
```

## 🔧 Configuration

### Connection String

The default connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "Database": "Host=localhost;Port=5432;Database=pointofsale-db;Username=postgres;Password=postgres"
  }
}
```

When running in Docker, this is overridden via environment variables in `docker-compose.yml`.

## 📚 Technologies

- **.NET 10** - Web API framework
- **Entity Framework Core 10** - ORM with PostgreSQL
- **MediatR** - CQRS and domain events
- **FluentValidation** - Request validation
- **Serilog** - Structured logging
- **Dapper** - Micro ORM for read queries
- **Docker** - Containerization

## 📄 License

This project is for educational purposes.
