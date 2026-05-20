# Recipe: Scaffold a Greenfield Project

Set up a complete .NET Clean Architecture solution from scratch, ready for feature development.

## Skills Used

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `01-dotnet-clean-architecture` | Solution structure, layers, DI |
| 2 | `08-dotnet-result-pattern` | Error handling foundation |
| 3 | `10-dotnet-pipeline-behaviors` | Logging, validation, transaction behaviors |
| 4 | `25.1-dotnet-postgresql-best-practices` or `25.2-dotnet-sqlserver-best-practices` | Database conventions |
| 5 | `26-dotnet-options-pattern` | Strongly-typed configuration |
| 6 | `23-dotnet-logging-configuration` | Structured logging with Serilog |
| 7 | `17-dotnet-health-checks` | Liveness and readiness endpoints |
| 8 | `18-dotnet-audit-trail` | CreatedAt/UpdatedAt tracking |

## Steps

### Step 1 — Scaffold the solution

> Using skill `01-dotnet-clean-architecture`, scaffold a new Clean Architecture solution called `{YourProject}` with Domain, Application, Infrastructure, and API layers.

**Verify:** You should have a `.sln` file, four projects with correct references, and `DependencyInjection.cs` in Application and Infrastructure.

### Step 2 — Add the Result pattern

> Using skill `08-dotnet-result-pattern`, add the Result, Result\<T\>, and Error types to the Domain layer.

**Verify:** `Result.cs` and `Error.cs` exist in `Domain/Abstractions/`. Commands and queries will return these types.

### Step 3 — Add pipeline behaviors

> Using skill `10-dotnet-pipeline-behaviors`, add logging, validation, and exception handling pipeline behaviors to the Application layer. Register them in DependencyInjection.

**Verify:** `LoggingBehavior`, `ValidationBehavior`, and `ExceptionHandlingBehavior` exist in `Application/Behaviors/` and are registered in `AddApplication()`.

### Step 4 — Configure the database

> Using skill `25.1-dotnet-postgresql-best-practices` (or `25.2-dotnet-sqlserver-best-practices`), set up the DbContext with proper naming conventions, connection pooling, and retry policies.

**Verify:** `ApplicationDbContext` exists in Infrastructure. Connection string uses pooling settings. Snake case naming convention is applied (PostgreSQL) or PascalCase defaults are confirmed (SQL Server).

### Step 5 — Add strongly-typed configuration

> Using skill `26-dotnet-options-pattern`, create options classes for Database and any other configuration sections. Use `ValidateDataAnnotations()` and `ValidateOnStart()`.

**Verify:** Options classes exist with `SectionName` constants. Registration uses `AddOptions<T>().Bind().ValidateOnStart()`.

### Step 6 — Add structured logging

> Using skill `23-dotnet-logging-configuration`, configure Serilog with console and file sinks, request logging, and log enrichment.

**Verify:** `Program.cs` uses `UseSerilog()`. Requests are logged with timing. Log output is structured JSON.

### Step 7 — Add health checks

> Using skill `17-dotnet-health-checks`, add health check endpoints for the database and any external dependencies. Map `/health` for liveness and `/health/ready` for readiness.

**Verify:** `GET /health` returns `Healthy`. Database health check is registered.

### Step 8 — Add audit trail

> Using skill `18-dotnet-audit-trail`, add the `IAuditable` interface and the EF Core `SaveChanges` interceptor that auto-populates `CreatedAt`, `UpdatedAt`, `CreatedBy`, and `UpdatedBy`.

**Verify:** `IAuditable.cs` exists in Domain. The interceptor is registered in Infrastructure DI.

## What You Have Now

```
{YourProject}/
├── src/
│   ├── {name}.domain/
│   │   ├── Abstractions/      # Entity, Result, Error, IDomainEvent, IAuditable
│   │   └── ...
│   ├── {name}.application/
│   │   ├── Behaviors/         # Logging, Validation, Exception handling
│   │   ├── Options/           # Strongly-typed configuration
│   │   └── DependencyInjection.cs
│   ├── {name}.infrastructure/
│   │   ├── Data/              # DbContext, connection factory
│   │   ├── Interceptors/      # Audit trail
│   │   └── DependencyInjection.cs
│   └── {name}.api/
│       ├── Program.cs         # Serilog, health checks
│       └── appsettings.json
└── {YourProject}.sln
```

Your solution is ready for feature development. Next: [Add a CRUD Feature](01-add-crud-feature.md).
