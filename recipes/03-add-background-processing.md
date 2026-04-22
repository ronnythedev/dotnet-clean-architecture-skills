# Recipe: Add Background Jobs with Reliable Events

Set up domain event processing with the Outbox pattern and scheduled background jobs.

**Prerequisite:** A scaffolded project with at least one entity that raises domain events (see [Add a CRUD Feature](01-add-crud-feature.md)).

## Skills Used

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `09-domain-events-generator` | Domain event records and notification handlers |
| 2 | `14-outbox-pattern` | Persist events in the same transaction, process asynchronously |
| 3 | `15-quartz-background-jobs` | Scheduled job to process outbox messages |

## Steps

### Step 1 — Define domain events and handlers

> Using skill `09-domain-events-generator`, create domain events for your entity (e.g., `OrderCreatedDomainEvent`, `OrderCompletedDomainEvent`). Create notification handlers that react to each event.

**Verify:** Events are records implementing `IDomainEvent`. Entity raises events via `RaiseDomainEvent()` in its methods. Handlers implement `INotificationHandler<T>`.

### Step 2 — Add the Outbox pattern

> Using skill `14-outbox-pattern`, add the `OutboxMessage` entity, its EF Core configuration, and the `SaveChanges` interceptor that converts domain events to outbox messages within the same transaction.

**Verify:** `OutboxMessage` has `Id`, `Type`, `Content`, `OccurredOnUtc`, `ProcessedOnUtc`, and `Error` columns. The interceptor serializes domain events as JSON into the outbox table before `SaveChangesAsync` commits.

### Step 3 — Add the outbox processor job

> Using skill `15-quartz-background-jobs`, create a Quartz job that polls the outbox table, deserializes events, and publishes them via MediatR. Configure it to run on a short interval (e.g., every 10 seconds). Add Quartz DI registration.

**Verify:** The job reads unprocessed `OutboxMessage` rows, deserializes to `IDomainEvent`, calls `publisher.Publish()`, and marks them as processed. Failed events get the error message stored. Run the app and verify events are processed in the console logs.

## What You Have Now

```
Domain/{Aggregate}/Events/
├── {Entity}CreatedDomainEvent.cs
└── {Entity}CompletedDomainEvent.cs

Application/{Feature}/Events/
├── {Entity}CreatedDomainEventHandler.cs
└── {Entity}CompletedDomainEventHandler.cs

Infrastructure/Outbox/
├── OutboxMessage.cs
├── OutboxMessageConfiguration.cs
└── OutboxInterceptor.cs

Infrastructure/BackgroundJobs/
├── ProcessOutboxMessagesJob.cs
└── QuartzConfiguration.cs
```

## How It Works

```
Entity.Create()
    → RaiseDomainEvent(new EntityCreatedDomainEvent(...))
    → SaveChangesAsync()
        → OutboxInterceptor converts events to OutboxMessage rows
        → Single transaction: entity + outbox messages saved together
    → Quartz job (every N seconds)
        → Reads unprocessed outbox messages
        → Deserializes and publishes via MediatR
        → Handlers execute (send email, update cache, notify, etc.)
```

## Optional Next Steps

- Add email notifications on events: [Add Email Notifications](04-add-email-notifications.md)
