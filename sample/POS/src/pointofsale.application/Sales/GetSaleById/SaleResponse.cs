namespace pointofsale.application.Sales.GetSaleById;

public sealed record SaleResponse(
    Guid Id,
    Guid? CustomerId,
    string PaymentMethod,
    decimal Subtotal,
    decimal TaxAmount,
    decimal DiscountAmount,
    decimal TotalAmount,
    string Status,
    DateTime CreatedAt,
    DateTime? CompletedAt,
    List<SaleItemResponse> Items);

public sealed record SaleItemResponse(
    Guid Id,
    Guid ProductId,
    string ProductName,
    decimal UnitPrice,
    int Quantity,
    decimal TotalPrice);
