# .NET Clean Architecture Skills Collection

## Overview

This collection of Claude Skills provides comprehensive templates and best practices for building .NET applications following Clean Architecture, CQRS, and Domain-Driven Design patterns.

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
| 7 | **api-controller-generator** | REST API endpoints | Controllers, Authorization, Versioning |
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
| Quartz.NET | 3+ | Background jobs |
| Serilog | 3+ | Logging |
| xUnit | 2.6+ | Testing framework |
| NSubstitute | 5+ | Mocking |
| Testcontainers | 3+ | Integration testing |

---

## Usage

To use a skill with Claude Code you have some options

- For personal skills available across all projects, you can place them in `~/.claude/skills/`
- Or just in `./skills/` in your project
- Personally I like to place them inside the project's git repo, inside a `CLAUDE` directory and mention their location in the main `CLAUDE.md` file in the root of the repo.

Then ask Claude to apply the patterns to your specific use case.

Each skill contains:
- Overview and purpose
- Quick reference table
- Complete code templates
- Usage examples
- Best practices
- Anti-patterns to avoid
- Related skills

---

_Have suggestions or want to contribute? Open an issue or PR on GitHub. Let's make .NET Clean Architecture accessible to everyone._