using pointofsale.domain.Abstractions;

namespace pointofsale.domain.Sales;

public sealed record SaleCompletedDomainEvent(Guid SaleId) : IDomainEvent;
