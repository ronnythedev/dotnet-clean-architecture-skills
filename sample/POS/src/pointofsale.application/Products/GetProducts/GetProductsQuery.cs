using pointofsale.application.Abstractions.Messaging;

namespace pointofsale.application.Products.GetProducts;

public sealed record GetProductsQuery() : IQuery<IReadOnlyList<ProductResponse>>;
