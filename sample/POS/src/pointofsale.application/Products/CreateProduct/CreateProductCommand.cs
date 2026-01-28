using pointofsale.application.Abstractions.Messaging;

namespace pointofsale.application.Products.CreateProduct;

public sealed record CreateProductCommand(
    string Name,
    string Sku,
    string? Description,
    decimal Price,
    decimal Cost,
    int StockQuantity,
    Guid CategoryId) : ICommand<Guid>;
