namespace pointofsale.domain.Sales;

public sealed class SaleItem
{
    private SaleItem(
        Guid id,
        Guid saleId,
        Guid productId,
        string productName,
        decimal unitPrice,
        int quantity)
    {
        Id = id;
        SaleId = saleId;
        ProductId = productId;
        ProductName = productName;
        UnitPrice = unitPrice;
        Quantity = quantity;
    }

    private SaleItem() { } // EF Core

    public Guid Id { get; private set; }
    public Guid SaleId { get; private set; }
    public Guid ProductId { get; private set; }
    public string ProductName { get; private set; } = string.Empty;
    public decimal UnitPrice { get; private set; }
    public int Quantity { get; private set; }
    public decimal TotalPrice => UnitPrice * Quantity;

    public static SaleItem Create(
        Guid saleId,
        Guid productId,
        string productName,
        decimal unitPrice,
        int quantity)
    {
        return new SaleItem(
            Guid.NewGuid(),
            saleId,
            productId,
            productName,
            unitPrice,
            quantity);
    }

    public void UpdateQuantity(int quantity)
    {
        Quantity = quantity;
    }
}
