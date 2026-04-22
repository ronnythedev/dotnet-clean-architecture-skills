# Recipe: Add a Full CRUD Feature

Add a new aggregate with Create, Read, Update, and Delete operations — from domain entity to API endpoint.

**Prerequisite:** A scaffolded project (see [Scaffold a New Project](00-scaffold-new-project.md)).

## Skills Used

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `04-domain-entity-generator` | Entity with factory methods, value objects, events |
| 2 | `05-repository-pattern` | Repository interface (Domain) + implementation (Infrastructure) |
| 3 | `06-ef-core-configuration` | Fluent API mapping to database |
| 4 | `02-cqrs-command-generator` | Create, Update, Delete commands with handlers |
| 5 | `03-cqrs-query-generator` | GetById, GetAll queries with Dapper |
| 6 | `11-fluent-validation` | Input validation for commands |
| 7 | `07.2-minimal-api-endpoints` | REST API endpoints |

## Steps

### Step 1 — Create the domain entity

> Using skill `04-domain-entity-generator`, create a `{Entity}` aggregate root with properties: {list your properties}. Include a `Create` factory method, an `Update` method, and domain events for creation and update.

**Verify:** Entity has private setters, a static `Create()` method, and raises `{Entity}CreatedDomainEvent`. `{Entity}Errors.cs` defines typed errors like `NotFound`.

### Step 2 — Add the repository

> Using skill `05-repository-pattern`, create `I{Entity}Repository` in the Domain layer and `{Entity}Repository` in Infrastructure. Include `GetByIdAsync`, `AddAsync`, and `UpdateAsync`.

**Verify:** The interface is in `Domain/{Entity}/I{Entity}Repository.cs`. The implementation is in `Infrastructure/Repositories/{Entity}Repository.cs` and is registered in DI.

### Step 3 — Add EF Core configuration

> Using skill `06-ef-core-configuration`, create `{Entity}Configuration` using Fluent API. Map properties, relationships, and indexes.

**Verify:** `{Entity}Configuration.cs` exists in `Infrastructure/Configurations/`. Table name follows your database convention. Foreign keys and unique constraints are indexed. Run `dotnet ef migrations add Add{Entity}` to verify the mapping compiles.

### Step 4 — Create commands

> Using skill `02-cqrs-command-generator`, create commands for `Create{Entity}`, `Update{Entity}`, and `Delete{Entity}`. Each command should have a handler that uses the repository and unit of work.

**Verify:** Each command folder contains the command record, handler, and request DTO. Handlers return `Result<Guid>` (Create) or `Result` (Update/Delete). All handlers call `unitOfWork.SaveChangesAsync()`.

### Step 5 — Create queries

> Using skill `03-cqrs-query-generator`, create `Get{Entity}ById` and `GetAll{Entities}` queries using Dapper. Return response DTOs, not domain entities.

**Verify:** Queries use `ISqlConnectionFactory` and raw SQL (not EF Core). Response DTOs are flat — no nested domain objects. Column names in SQL match your database naming convention.

### Step 6 — Add validation

> Using skill `11-fluent-validation`, create validators for `Create{Entity}Command` and `Update{Entity}Command`. Validate required fields, string lengths, and business rules.

**Verify:** Validators inherit from `AbstractValidator<T>`. Rules use `.NotEmpty()`, `.MaximumLength()`, etc. The `ValidationBehavior` pipeline (from scaffolding) will execute them automatically.

### Step 7 — Add API endpoints

> Using skill `07.2-minimal-api-endpoints`, create endpoints for the `{Entity}` feature: `POST`, `GET /{id}`, `GET /`, `PUT /{id}`, `DELETE /{id}`. Use MediatR to dispatch commands and queries.

**Verify:** Endpoints are registered in a static `Map{Entity}Endpoints` extension method. Routes follow REST conventions. Run the API and test with Swagger or `curl`.

## What You Have Now

```
Domain/{Entity}/
├── {Entity}.cs                      # Aggregate root
├── {Entity}Errors.cs                # Typed errors
├── I{Entity}Repository.cs           # Repository interface
├── ValueObjects/                    # If applicable
└── Events/
    └── {Entity}CreatedDomainEvent.cs

Application/{Feature}/
├── Create{Entity}/
│   ├── Create{Entity}Command.cs     # Command + Validator + Handler
│   └── Create{Entity}Request.cs
├── Update{Entity}/
│   ├── Update{Entity}Command.cs
│   └── Update{Entity}Request.cs
├── Delete{Entity}/
│   └── Delete{Entity}Command.cs
├── Get{Entity}ById/
│   ├── Get{Entity}ByIdQuery.cs      # Query + Handler
│   └── {Entity}Response.cs
└── GetAll{Entities}/
    └── GetAll{Entities}Query.cs

Infrastructure/
├── Configurations/{Entity}Configuration.cs
└── Repositories/{Entity}Repository.cs

API/Endpoints/{Feature}/{Feature}Endpoints.cs
```

## Optional Next Steps

- Add domain event handlers: [Add Background Processing](03-add-background-processing.md)
- Add tests: [Add Testing](05-add-testing.md)
- Add authentication: [Add JWT Authentication](02-add-authentication.md)
