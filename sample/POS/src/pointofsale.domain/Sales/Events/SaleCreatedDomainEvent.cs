using pointofsale.domain.Abstractions;

namespace pointofsale.domain.Sales;

public sealed record SaleCreatedDomainEvent(Guid SaleId) : IDomainEvent;
