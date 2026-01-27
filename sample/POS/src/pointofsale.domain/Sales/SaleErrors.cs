using pointofsale.domain.Abstractions;

namespace pointofsale.domain.Sales;

public static class SaleErrors
{
    public static readonly Error NotFound = new(
        "Sale.NotFound",
        "The sale with the specified identifier was not found");

    public static readonly Error ItemNotFound = new(
        "Sale.ItemNotFound",
        "The sale item was not found");

    public static readonly Error NoItems = new(
        "Sale.NoItems",
        "Cannot complete a sale with no items");

    public static readonly Error CannotComplete = new(
        "Sale.CannotComplete",
        "Only pending sales can be completed");

    public static readonly Error CannotCancel = new(
        "Sale.CannotCancel",
        "Only pending sales can be cancelled");

    public static readonly Error AlreadyCompleted = new(
        "Sale.AlreadyCompleted",
        "This sale has already been completed");
}
