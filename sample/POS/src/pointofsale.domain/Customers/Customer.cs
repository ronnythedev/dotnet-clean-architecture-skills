using pointofsale.domain.Abstractions;

namespace pointofsale.domain.Customers;

public sealed class Customer : Entity
{
    private Customer(
        Guid id,
        string name,
        string? email,
        string? phone,
        string? address,
        bool isActive)
        : base(id)
    {
        Name = name;
        Email = email;
        Phone = phone;
        Address = address;
        IsActive = isActive;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    private Customer() { } // EF Core

    public string Name { get; private set; } = string.Empty;
    public string? Email { get; private set; }
    public string? Phone { get; private set; }
    public string? Address { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public static Customer Create(
        string name,
        string? email,
        string? phone,
        string? address)
    {
        return new Customer(
            Guid.NewGuid(),
            name,
            email,
            phone,
            address,
            isActive: true);
    }

    public void Update(
        string name,
        string? email,
        string? phone,
        string? address)
    {
        Name = name;
        Email = email;
        Phone = phone;
        Address = address;
        UpdatedAt = DateTime.UtcNow;
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
