using pointofsale.application.Abstractions.Messaging;

namespace pointofsale.application.Sales.GetSaleById;

public sealed record GetSaleByIdQuery(Guid SaleId) : IQuery<SaleResponse>;
