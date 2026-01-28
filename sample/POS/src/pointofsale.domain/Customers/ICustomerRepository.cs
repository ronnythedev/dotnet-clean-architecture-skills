namespace pointofsale.domain.Customers;

public interface ICustomerRepository
{
    Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Customer?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Customer>> GetAllActiveAsync(CancellationToken cancellationToken = default);
    void Add(Customer customer);
    void Update(Customer customer);
    void Remove(Customer customer);
}
