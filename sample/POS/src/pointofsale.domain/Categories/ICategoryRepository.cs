namespace pointofsale.domain.Categories;

public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Category?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Category>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Category>> GetAllActiveAsync(CancellationToken cancellationToken = default);
    void Add(Category category);
    void Update(Category category);
    void Remove(Category category);
}
