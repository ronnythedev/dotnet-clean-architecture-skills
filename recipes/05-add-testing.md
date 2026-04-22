# Recipe: Add Unit and Integration Tests

Add comprehensive test coverage for an existing feature — from handler unit tests to full API integration tests.

**Prerequisite:** At least one CRUD feature with commands, queries, and endpoints (see [Add a CRUD Feature](01-add-crud-feature.md)).

## Skills Used

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `21-unit-testing` | Handler tests with xUnit and NSubstitute |
| 2 | `22-integration-testing` | API tests with WebApplicationFactory and Testcontainers |

## Steps

### Step 1 — Add unit tests for command handlers

> Using skill `21-unit-testing`, create unit tests for `Create{Entity}CommandHandler`. Mock the repository and unit of work with NSubstitute. Test success, validation failure, and domain error scenarios using Arrange-Act-Assert.

**Verify:** Tests cover:
- Happy path: returns `Result.Success` with the entity ID
- Entity not found: returns the correct error
- Repository is called with correct arguments
- `SaveChangesAsync` is called exactly once

### Step 2 — Add unit tests for query handlers

> Using skill `21-unit-testing`, create unit tests for `Get{Entity}ByIdQueryHandler`. Mock `ISqlConnectionFactory`. Test that not-found returns the correct error.

**Verify:** Tests verify the handler returns a mapped DTO on success and a typed error when the entity doesn't exist.

### Step 3 — Set up the integration test infrastructure

> Using skill `22-integration-testing`, create the test project with `WebApplicationFactory`, Testcontainers for the database, and Respawn for database cleanup between tests. Add an `IntegrationTestBase` class.

**Verify:** The test project references the API project. `IntegrationTestWebAppFactory` starts a real database in Docker. `Respawn` cleans tables between tests. Tests can make HTTP requests via `HttpClient`.

### Step 4 — Add integration tests for endpoints

> Using skill `22-integration-testing`, create integration tests for the `{Entity}` endpoints. Test `POST` (create), `GET /{id}` (read), `PUT /{id}` (update), and `DELETE /{id}`. Each test hits the real API and database.

**Verify:** Tests cover:
- Create returns `201 Created` with a valid ID
- Get returns the created entity
- Update modifies the entity
- Delete removes the entity
- Get after delete returns `404`
- Invalid input returns `400` with validation errors

## What You Have Now

```
tests/
├── {name}.application.unittests/
│   ├── {Feature}/
│   │   ├── Create{Entity}CommandHandlerTests.cs
│   │   ├── Update{Entity}CommandHandlerTests.cs
│   │   ├── Delete{Entity}CommandHandlerTests.cs
│   │   └── Get{Entity}ByIdQueryHandlerTests.cs
│   └── {name}.application.unittests.csproj
│
└── {name}.api.integrationtests/
    ├── Infrastructure/
    │   ├── IntegrationTestWebAppFactory.cs
    │   └── IntegrationTestBase.cs
    ├── {Feature}/
    │   └── {Entity}EndpointTests.cs
    └── {name}.api.integrationtests.csproj
```

## Running Tests

```bash
# Unit tests (fast, no Docker needed)
dotnet test tests/{name}.application.unittests

# Integration tests (requires Docker for Testcontainers)
dotnet test tests/{name}.api.integrationtests

# All tests
dotnet test
```
