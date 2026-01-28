using pointofsale.domain.Abstractions;

namespace pointofsale.domain.Products;

public sealed record ProductCreatedDomainEvent(Guid ProductId) : IDomainEvent;
