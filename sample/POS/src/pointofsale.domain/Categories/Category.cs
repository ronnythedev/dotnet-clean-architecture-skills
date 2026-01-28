using pointofsale.domain.Abstractions;

namespace pointofsale.domain.Categories;

public sealed class Category : Entity
{
    private Category(
        Guid id,
        string name,
        string? description,
        bool isActive)
        : base(id)
    {
        Name = name;
        Description = description;
        IsActive = isActive;
        CreatedAt = DateTime.UtcNow;
    }

    private Category() { } // EF Core

    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public static Category Create(string name, string? description)
    {
        return new Category(
            Guid.NewGuid(),
            name,
            description,
            isActive: true);
    }

    public void Update(string name, string? description)
    {
        Name = name;
        Description = description;
    }

    public void Deactivate() => IsActive = false;

    public void Activate() => IsActive = true;
}
