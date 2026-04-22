# Recipe: Add JWT Authentication and Authorization

Add JWT Bearer authentication with refresh tokens and permission-based authorization to an existing project.

**Prerequisite:** A scaffolded project (see [Scaffold a New Project](00-scaffold-new-project.md)).

## Skills Used

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `04-domain-entity-generator` | User entity and Role/Permission value objects |
| 2 | `12-jwt-authentication` | JWT token generation, validation, refresh tokens |
| 3 | `13-permission-authorization` | Permission-based access control |
| 4 | `06-ef-core-configuration` | User and Role EF Core mappings |
| 5 | `07.2-minimal-api-endpoints` | Auth endpoints (login, register, refresh) |

## Steps

### Step 1 — Create the User entity

> Using skill `04-domain-entity-generator`, create a `User` aggregate root with Email (value object), PasswordHash, FirstName, LastName, and a collection of Roles. Include a `Create` factory method and an `UpdatePassword` method.

**Verify:** `User.cs` has private setters. `Email` is a value object with validation. Roles are a collection, not a string.

### Step 2 — Configure JWT authentication

> Using skill `12-jwt-authentication`, add `JwtOptions`, `JwtService`, `JwtBearerOptionsSetup`, and `UserContext`. Configure refresh tokens stored in HttpOnly cookies. Register JWT authentication in `DependencyInjection`.

**Verify:** `JwtOptions` has `SectionName` constant. `IJwtService` is in Application, `JwtService` is in Infrastructure. `Program.cs` calls `AddAuthentication().AddJwtBearer()`. `appsettings.json` has the `Jwt` section with Issuer, Audience, and SecretKey.

### Step 3 — Add permission-based authorization

> Using skill `13-permission-authorization`, add `HasPermissionAttribute`, `PermissionRequirement`, `PermissionAuthorizationHandler`, and `PermissionAuthorizationPolicyProvider`. Define permissions as constants.

**Verify:** You can decorate endpoints with `[HasPermission(Permissions.Products.Read)]`. The authorization handler checks the user's permissions from claims or database.

### Step 4 — Add EF Core configuration for User and Roles

> Using skill `06-ef-core-configuration`, create configurations for `User`, `Role`, and the `UserRole` join table. Map the Email value object as an owned type. Seed default roles and permissions.

**Verify:** Run `dotnet ef migrations add AddIdentity` — it should create tables for Users, Roles, Permissions, and join tables.

### Step 5 — Add auth endpoints

> Using skill `07.2-minimal-api-endpoints`, create endpoints: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`. Login returns an access token in the body and sets a refresh token cookie.

**Verify:** Register creates a user. Login returns a JWT. The token contains user ID, email, and permission claims. Protected endpoints return `401` without a token and `403` without the required permission.

## What You Have Now

```
Domain/Users/
├── User.cs
├── UserErrors.cs
├── IUserRepository.cs
├── ValueObjects/
│   └── Email.cs
├── Role.cs
└── Permission.cs

Application/Abstractions/Authentication/
├── IJwtService.cs
├── IUserContext.cs
└── TokenResponse.cs

Infrastructure/Authentication/
├── JwtOptions.cs
├── JwtService.cs
├── JwtBearerOptionsSetup.cs
├── UserContext.cs
└── CookieSettings.cs

Infrastructure/Authorization/
├── HasPermissionAttribute.cs
├── PermissionRequirement.cs
├── PermissionAuthorizationHandler.cs
└── PermissionAuthorizationPolicyProvider.cs

API/Endpoints/Auth/AuthEndpoints.cs
```

## Protecting Endpoints

After setup, protect any endpoint by adding the permission attribute:

```csharp
group.MapGet("/", async (ISender sender) => { ... })
    .RequireAuthorization(Permissions.Products.Read);
```
