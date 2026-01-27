using pointofsale.application.Abstractions.Messaging;

namespace pointofsale.application.Sales.CreateSale;

public sealed record CreateSaleCommand(
    Guid? CustomerId,
    string PaymentMethod,
    List<CreateSaleItemRequest> Items) : ICommand<Guid>;

public sealed record CreateSaleItemRequest(
    Guid ProductId,
    int Quantity);
