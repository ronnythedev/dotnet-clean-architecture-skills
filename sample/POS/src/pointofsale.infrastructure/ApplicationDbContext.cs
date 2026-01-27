using MediatR;
using Microsoft.EntityFrameworkCore;
using pointofsale.domain.Abstractions;
using pointofsale.domain.Categories;
using pointofsale.domain.Customers;
using pointofsale.domain.Products;
using pointofsale.domain.Sales;

namespace pointofsale.infrastructure;

public sealed class ApplicationDbContext : DbContext, IUnitOfWork
{
    private readonly IPublisher _publisher;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IPublisher publisher)
        : base(options)
    {
        _publisher = publisher;
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Sale> Sales => Set<Sale>();
    public DbSet<SaleItem> SaleItems => Set<SaleItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // 1. Collect all domain events from tracked entities
        var domainEvents = ChangeTracker
            .Entries<Entity>()
            .SelectMany(entry => entry.Entity.GetDomainEvents())
            .ToList();

        // 2. Clear domain events from entities (prevent duplicate publishing)
        foreach (var entry in ChangeTracker.Entries<Entity>())
        {
            entry.Entity.ClearDomainEvents();
        }

        // 3. Save changes to database
        var result = await base.SaveChangesAsync(cancellationToken);

        // 4. Publish domain events after successful save
        foreach (var domainEvent in domainEvents)
        {
            await _publisher.Publish(domainEvent, cancellationToken);
        }

        return result;
    }
}
