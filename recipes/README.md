# Recipes

Step-by-step workflows that combine multiple skills to accomplish common tasks. Each recipe tells you which skills to use, in what order, and what to verify at each step.

## Available Recipes

| # | Recipe | Skills Used | Description |
|---|--------|-------------|-------------|
| 0 | [Scaffold a New Project](00-scaffold-new-project.md) | 01, 08, 10, 17, 18, 23, 25.x, 26 | Set up a complete Clean Architecture solution from scratch |
| 1 | [Add a CRUD Feature](01-add-crud-feature.md) | 02, 03, 04, 05, 06, 07.2, 11 | Entity, commands, queries, validation, and API endpoints |
| 2 | [Add JWT Authentication](02-add-authentication.md) | 04, 06, 07.2, 12, 13 | JWT tokens, refresh tokens, permission-based authorization |
| 3 | [Add Background Processing](03-add-background-processing.md) | 09, 14, 15 | Domain events, Outbox pattern, Quartz jobs |
| 4 | [Add Email Notifications](04-add-email-notifications.md) | 09, 16.x, 26 | Transactional emails triggered by domain events |
| 5 | [Add Testing](05-add-testing.md) | 21, 22 | Unit tests for handlers, integration tests for endpoints |

## Suggested Order for a New Project

```
Scaffold (Recipe 0)
    └── Add your first feature (Recipe 1)
            ├── Add authentication (Recipe 2)
            ├── Add background processing (Recipe 3)
            │       └── Add email notifications (Recipe 4)
            └── Add testing (Recipe 5)
```

Recipes 2–5 are independent of each other and can be done in any order after Recipe 1.
