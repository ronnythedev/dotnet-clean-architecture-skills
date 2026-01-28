using pointofsale.domain.Abstractions;

namespace pointofsale.domain.Customers;

public static class CustomerErrors
{
    public static readonly Error NotFound = new(
        "Customer.NotFound",
        "The customer with the specified identifier was not found");

    public static readonly Error DuplicateEmail = new(
        "Customer.DuplicateEmail",
        "A customer with this email already exists");
}
