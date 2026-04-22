# Recipe: Add Email Notifications on Domain Events

Send transactional emails when domain events occur, with reliable delivery through the Outbox pattern.

**Prerequisite:** Background processing with the Outbox pattern (see [Add Background Processing](03-add-background-processing.md)).

## Skills Used

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `16.1-email-service-sendgrid` or `16.2-email-service-aws-ses` | Email service abstraction and provider |
| 2 | `09-domain-events-generator` | Event handler that triggers the email |
| 3 | `26-options-pattern` | Email configuration (API keys, sender address) |

## Steps

### Step 1 — Add the email service

> Using skill `16.1-email-service-sendgrid` (or `16.2-email-service-aws-ses`), add `IEmailService` to the Application layer and the provider implementation in Infrastructure. Include HTML template support with placeholder replacement.

**Verify:** `IEmailService` defines `SendAsync(EmailMessage)`. The implementation is registered in DI. Configuration includes sender address, API key, and template directory.

### Step 2 — Configure email options

> Using skill `26-options-pattern`, create `EmailOptions` with `SenderAddress`, `SenderName`, and provider-specific settings. Use `ValidateDataAnnotations()` and `ValidateOnStart()`.

**Verify:** `appsettings.json` has the `Email` section. Missing or invalid configuration fails at startup, not at send time.

### Step 3 — Create the event handler

> Using skill `09-domain-events-generator`, create a domain event handler for `{Entity}CreatedDomainEvent` that sends a notification email. Inject `IEmailService` and build the email from a template.

**Verify:** The handler is a `INotificationHandler<{Entity}CreatedDomainEvent>`. It calls `IEmailService.SendAsync()`. Because the Outbox pattern processes events asynchronously, email failures don't break the original transaction.

## What You Have Now

```
Application/Abstractions/Email/
├── IEmailService.cs
└── EmailMessage.cs

Application/{Feature}/Events/
└── Send{Entity}NotificationHandler.cs

Infrastructure/Email/
├── EmailOptions.cs
├── SendGridEmailService.cs (or SesEmailService.cs)
└── Templates/
    └── {entity}-created.html
```

## How It Works

```
User creates entity via API
    → Entity saved + outbox message in same transaction
    → Quartz job picks up outbox message
    → MediatR publishes EntityCreatedDomainEvent
    → Send{Entity}NotificationHandler calls IEmailService
    → Email sent via SendGrid/SES
    → If email fails, outbox message retries on next job run
```
