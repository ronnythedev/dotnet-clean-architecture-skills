namespace pointofsale.application.Products.GetProducts;

public sealed record ProductResponse(
    Guid Id,
    string Name,
    string Sku,
    string? Description,
    decimal Price,
    decimal Cost,
    int StockQuantity,
    Guid CategoryId,
    bool IsActive,
    DateTime CreatedAt);
