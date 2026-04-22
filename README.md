# .NET Clean Architecture Skills

**27 AI-ready skills** that teach your coding assistant how to generate production-grade .NET code — Clean Architecture, CQRS, DDD — without explaining the patterns every time.

**Works with:** Claude Code | GitHub Copilot | Cursor

### Before (plain prompt)

> "Create a Product entity with name, price, and category"

Your assistant generates a basic class with public setters, no validation, no events, inconsistent patterns.

### After (with skills installed)

> "Using skill `04-domain-entity-generator`, create a Product aggregate root with Name (required, max 200), Price (positive decimal), and a CategoryId foreign key"

Your assistant generates a proper DDD entity with private setters, a `Create()` factory method, domain events, typed errors, and a repository interface — matching the patterns already in your codebase.

### Get started in 30 seconds

```bash
# Clone into your project (Claude Code + Copilot)
git clone https://github.com/ronnydelgado/dotnet-clean-architecture-skills.git

# Or copy all skills globally (Claude Code)
cp -r skills/* ~/.claude/skills/
```

Then follow [Recipe 0: Scaffold a New Project](recipes/00-scaffold-new-project.md) or jump to [Recipe 1: Add a CRUD Feature](recipes/01-add-crud-feature.md) if you already have a solution.

---

## Skills Index

### Core Architecture Skills

| # | Skill | Description | Key Templates |
|---|-------|-------------|---------------|
| 1 | **dotnet-clean-architecture** | Project scaffolding | Solution structure, layer setup, DI configuration |
| 2 | **cqrs-command-generator** | Write operations | Commands, Handlers, Validators |
| 3 | **cqrs-query-generator** | Read operations | Queries, Dapper SQL, Response DTOs |
| 4 | **domain-entity-generator** | Domain modeling | Entities, Value Objects, Factory methods |
| 5 | **repository-pattern** | Data access abstraction | Repository interfaces, EF Core implementations |
| 6 | **ef-core-configuration** | Database mapping | Fluent API, Relationships, Indexes |
| 7.1 | **legacy-api-controllers** | REST API controllers | Controllers, Authorization, Versioning |
| 7.2 | **minimal-api-endpoints** | Minimal API endpoints | MapGet/MapPost, Filters, Versioning |
| 8 | **result-pattern** | Error handling | Result, Result<T>, Error types |
| 9 | **domain-events-generator** | Event-driven design | Domain Events, Handlers, Outbox pattern |
| 10 | **pipeline-behaviors** | Cross-cutting concerns | Logging, Validation, Transaction behaviors |

### Validation Skills

| # | Skill | Description | Key Templates |
|---|-------|-------------|---------------|
| 11 | **fluent-validation** | Input validation | AbstractValidator, Custom validators, Async validation |

### Security Skills

| # | Skill | Description | Key Templates |
|---|-------|-------------|---------------|
| 12 | **jwt-authentication** | JWT Bearer auth | JwtService, Token validation, Refresh tokens |
| 13 | **permission-authorization** | Permission-based access | HasPermission attribute, Policy provider |

### Infrastructure Skills

| # | Skill | Description | Key Templates |
|------|-------|-------------|---------------|
| 14   | **outbox-pattern** | Reliable messaging | OutboxMessage, Processor job, Idempotency |
| 15   | **quartz-background-jobs** | Scheduled jobs | IJob, Cron scheduling, Job configuration |
| 16.1 | **email-service-sendgrid** | Email integration | IEmailService, SendGrid, Templates |
| 16.2 | **email-service-aws-ses** | Email integration | IEmailService, AWS SES, Local Templates |
| 17   | **health-checks** | Dependency monitoring | PostgreSQL, HTTP, Custom checks |
| 18   | **audit-trail** | Change tracking | IAuditable, EF interceptor, Soft delete |

### Data Access Skills

| # | Skill | Description | Key Templates |
|---|-------|-------------|---------------|
| 19 | **dapper-query-builder** | Optimized reads | Multi-mapping, Pagination, CTEs |
| 20 | **specification-pattern** | Query encapsulation | ISpecification, Composable queries |

### Testing Skills

| # | Skill | Description | Key Templates |
|---|-------|-------------|---------------|
| 21 | **unit-testing** | Unit tests | xUnit, NSubstitute, FluentAssertions |
| 22 | **integration-testing** | Integration tests | WebApplicationFactory, Testcontainers, Respawn |

### Cross-Cutting Skills

| # | Skill | Description | Key Templates |
|------|-------|-------------|---------------|
| 23   | **logging-configuration** | Structured logging | Serilog, ILogger, Log enrichment |
| 24   | **rate-limiting** | API protection | Fixed/Sliding window, Token bucket, Concurrency |

### Database Skills

| # | Skill | Description | Key Templates |
|------|-------|-------------|---------------|
| 25.1 | **postgresql-best-practices** | PostgreSQL optimization | Naming, Indexing, xmin concurrency, Extensions |
| 25.2 | **sqlserver-best-practices** | SQL Server optimization | Naming, Indexing, rowversion, Temporal tables |
| 26   | **options-pattern** | Typed configuration | IOptions, IOptionsSnapshot, IOptionsMonitor, Validation |

---

## Recipes — Where to Start

Skills are building blocks. Recipes show you **which skills to combine and in what order** for common tasks.

| Recipe | What You Get |
|--------|-------------|
| [Scaffold a New Project](recipes/00-scaffold-new-project.md) | Complete solution structure with logging, health checks, and audit trail |
| [Add a CRUD Feature](recipes/01-add-crud-feature.md) | Entity + commands + queries + validation + API — the most common workflow |
| [Add JWT Authentication](recipes/02-add-authentication.md) | JWT tokens, refresh tokens, and permission-based authorization |
| [Add Background Processing](recipes/03-add-background-processing.md) | Domain events with Outbox pattern and Quartz scheduled jobs |
| [Add Email Notifications](recipes/04-add-email-notifications.md) | Transactional emails triggered by domain events |
| [Add Testing](recipes/05-add-testing.md) | Unit tests with NSubstitute + integration tests with Testcontainers |

**New project?** Start with Recipe 0, then Recipe 1. Everything else is optional and independent.

See the full [Recipes guide](recipes/README.md) for the suggested order and dependency tree.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          API Layer                               │
│  • Controllers (api-controller-generator)                        │
│  • Request/Response DTOs                                         │
│  • Middleware                                                    │
│  • Authentication (jwt-authentication)                           │
│  • Authorization (permission-authorization)                      │
├─────────────────────────────────────────────────────────────────┤
│                      Application Layer                           │
│  • Commands (cqrs-command-generator)                             │
│  • Queries (cqrs-query-generator)                                │
│  • Validators (fluent-validation)                                │
│  • Pipeline Behaviors (pipeline-behaviors)                       │
│  • Event Handlers (domain-events-generator)                      │
├─────────────────────────────────────────────────────────────────┤
│                    Infrastructure Layer                          │
│  • Repositories (repository-pattern)                             │
│  • EF Core Configurations (ef-core-configuration)                │
│  • Dapper Queries (dapper-query-builder)                         │
│  • Outbox Pattern (outbox-pattern)                               │
│  • Background Jobs (quartz-background-jobs)                      │
│  • Email Service (email-service)                                 │
│  • Audit Trail (audit-trail)                                     │
│  • Health Checks (health-checks)                                 │
├─────────────────────────────────────────────────────────────────┤
│                       Domain Layer                               │
│  • Entities (domain-entity-generator)                            │
│  • Value Objects (domain-entity-generator)                       │
│  • Domain Events (domain-events-generator)                       │
│  • Result Pattern (result-pattern)                               │
│  • Specifications (specification-pattern)                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| .NET | 8+ | Framework |
| MediatR | 12+ | CQRS implementation |
| FluentValidation | 11+ | Request validation |
| Entity Framework Core | 8+ | ORM (write side) |
| Dapper | 2+ | Micro ORM (read side) |
| PostgreSQL | 15+ | Database |
| SQL Server | 2019+ | Database |
| Quartz.NET | 3+ | Background jobs |
| Serilog | 3+ | Logging |
| xUnit | 2.6+ | Testing framework |
| NSubstitute | 5+ | Mocking |
| Testcontainers | 3+ | Integration testing |

---

## Installation

### Option 1: Clone the repo (works with both Claude Code and GitHub Copilot)

```bash
git clone https://github.com/ronnydelgado/dotnet-clean-architecture-skills.git
```

The repo structure works out of the box for both tools:

- **GitHub Copilot** reads skills from `skills/` at the repo root.
- **Claude Code** reads skills from `.claude/skills/`, which is a symlink to `skills/`.

> **Windows note:** Git symlinks require either Developer Mode enabled or running Git as administrator. If symlinks don't resolve, run `git config core.symlinks true` and re-clone.

### Option 2: Copy individual skills into your project

Pick the skills you need and copy them into the appropriate location for your tool:

**Claude Code:**
```bash
# Copy a single skill
cp -r skills/01-dotnet-clean-architecture your-project/.claude/skills/

# Or copy all skills
cp -r skills/* your-project/.claude/skills/
```

**GitHub Copilot:**
```bash
# Copy a single skill
cp -r skills/01-dotnet-clean-architecture your-project/skills/

# Or copy all skills
cp -r skills/* your-project/skills/
```

### Option 3: Install globally for Claude Code

Make skills available across all your projects:

```bash
cp -r skills/* ~/.claude/skills/
```

### Using the skills

Once installed, ask Claude to apply the patterns to your specific use case. Each skill contains:
- Overview and purpose
- Quick reference table
- Complete code templates
- Usage examples
- Best practices
- Anti-patterns to avoid
- Related skills

---

## Credits

Skills 25.1 (`postgresql-best-practices`) and 26 (`options-pattern`) were inspired by [johnpuksta/clean-architecture-agents](https://github.com/johnpuksta/clean-architecture-agents), a fork that extends this collection with a multi-agent orchestration system.

---

_Have suggestions or want to contribute? Open an issue or PR on GitHub. Let's make .NET Clean Architecture accessible to everyone._
