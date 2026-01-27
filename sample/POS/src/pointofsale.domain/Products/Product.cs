using pointofsale.domain.Abstractions;

namespace pointofsale.domain.Products;

public sealed class Product : Entity
{
    private Product(
        Guid id,
        string name,
        string sku,
        string? description,
        decimal price,
        decimal cost,
        int stockQuantity,
        Guid categoryId,
        bool isActive)
        : base(id)
    {
        Name = name;
        Sku = sku;
        Description = description;
        Price = price;
        Cost = cost;
        StockQuantity = stockQuantity;
        CategoryId = categoryId;
        IsActive = isActive;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    private Product() { } // EF Core

    public string Name { get; private set; } = string.Empty;
    public string Sku { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public decimal Price { get; private set; }
    public decimal Cost { get; private set; }
    public int StockQuantity { get; private set; }
    public Guid CategoryId { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public static Product Create(
        string name,
        string sku,
        string? description,
        decimal price,
        decimal cost,
        int stockQuantity,
        Guid categoryId)
    {
        var product = new Product(
            Guid.NewGuid(),
            name,
            sku,
            description,
            price,
            cost,
            stockQuantity,
            categoryId,
            isActive: true);

        product.RaiseDomainEvent(new ProductCreatedDomainEvent(product.Id));

        return product;
    }

    public void Update(
        string name,
        string? description,
        decimal price,
        decimal cost,
        Guid categoryId)
    {
        Name = name;
        Description = description;
        Price = price;
        Cost = cost;
        CategoryId = categoryId;
        UpdatedAt = DateTime.UtcNow;
    }

    public Result AdjustStock(int quantity)
    {
        var newQuantity = StockQuantity + quantity;
        if (newQuantity < 0)
        {
            return Result.Failure(ProductErrors.InsufficientStock);
        }

        StockQuantity = newQuantity;
        UpdatedAt = DateTime.UtcNow;

        return Result.Success();
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }
}
