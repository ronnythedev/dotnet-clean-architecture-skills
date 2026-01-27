using pointofsale.domain.Abstractions;

namespace pointofsale.domain.Products;

public static class ProductErrors
{
    public static readonly Error NotFound = new(
        "Product.NotFound",
        "The product with the specified identifier was not found");

    public static readonly Error InsufficientStock = new(
        "Product.InsufficientStock",
        "The product does not have sufficient stock for this operation");

    public static readonly Error DuplicateSku = new(
        "Product.DuplicateSku",
        "A product with this SKU already exists");

    public static readonly Error InvalidPrice = new(
        "Product.InvalidPrice",
        "The product price must be greater than zero");

    public static readonly Error InvalidCost = new(
        "Product.InvalidCost",
        "The product cost must be zero or greater");
}
