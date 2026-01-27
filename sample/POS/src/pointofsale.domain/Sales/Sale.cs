using pointofsale.domain.Abstractions;

namespace pointofsale.domain.Sales;

public sealed class Sale : Entity
{
    private readonly List<SaleItem> _items = new();

    private Sale(
        Guid id,
        Guid? customerId,
        string paymentMethod,
        decimal subtotal,
        decimal taxAmount,
        decimal discountAmount,
        decimal totalAmount,
        SaleStatus status)
        : base(id)
    {
        CustomerId = customerId;
        PaymentMethod = paymentMethod;
        Subtotal = subtotal;
        TaxAmount = taxAmount;
        DiscountAmount = discountAmount;
        TotalAmount = totalAmount;
        Status = status;
        CreatedAt = DateTime.UtcNow;
    }

    private Sale() { } // EF Core

    public Guid? CustomerId { get; private set; }
    public string PaymentMethod { get; private set; } = string.Empty;
    public decimal Subtotal { get; private set; }
    public decimal TaxAmount { get; private set; }
    public decimal DiscountAmount { get; private set; }
    public decimal TotalAmount { get; private set; }
    public SaleStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public IReadOnlyList<SaleItem> Items => _items.AsReadOnly();

    public static Sale Create(Guid? customerId, string paymentMethod)
    {
        var sale = new Sale(
            Guid.NewGuid(),
            customerId,
            paymentMethod,
            subtotal: 0,
            taxAmount: 0,
            discountAmount: 0,
            totalAmount: 0,
            SaleStatus.Pending);

        sale.RaiseDomainEvent(new SaleCreatedDomainEvent(sale.Id));

        return sale;
    }

    public void AddItem(
        Guid productId,
        string productName,
        decimal unitPrice,
        int quantity)
    {
        var existingItem = _items.FirstOrDefault(i => i.ProductId == productId);
        
        if (existingItem is not null)
        {
            existingItem.UpdateQuantity(existingItem.Quantity + quantity);
        }
        else
        {
            var item = SaleItem.Create(Id, productId, productName, unitPrice, quantity);
            _items.Add(item);
        }

        RecalculateTotals();
    }

    public Result RemoveItem(Guid productId)
    {
        var item = _items.FirstOrDefault(i => i.ProductId == productId);
        
        if (item is null)
        {
            return Result.Failure(SaleErrors.ItemNotFound);
        }

        _items.Remove(item);
        RecalculateTotals();

        return Result.Success();
    }

    public void ApplyDiscount(decimal discountAmount)
    {
        DiscountAmount = discountAmount;
        RecalculateTotals();
    }

    public Result Complete()
    {
        if (Status != SaleStatus.Pending)
        {
            return Result.Failure(SaleErrors.CannotComplete);
        }

        if (!_items.Any())
        {
            return Result.Failure(SaleErrors.NoItems);
        }

        Status = SaleStatus.Completed;
        CompletedAt = DateTime.UtcNow;

        RaiseDomainEvent(new SaleCompletedDomainEvent(Id));

        return Result.Success();
    }

    public Result Cancel()
    {
        if (Status != SaleStatus.Pending)
        {
            return Result.Failure(SaleErrors.CannotCancel);
        }

        Status = SaleStatus.Cancelled;

        return Result.Success();
    }

    private void RecalculateTotals()
    {
        Subtotal = _items.Sum(i => i.TotalPrice);
        TaxAmount = Subtotal * 0.1m; // 10% tax - could be configurable
        TotalAmount = Subtotal + TaxAmount - DiscountAmount;
    }
}

public enum SaleStatus
{
    Pending = 0,
    Completed = 1,
    Cancelled = 2
}
