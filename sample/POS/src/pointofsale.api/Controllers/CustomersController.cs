using Microsoft.AspNetCore.Mvc;
using pointofsale.domain.Customers;
using pointofsale.domain.Abstractions;

namespace pointofsale.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CustomersController(
        ICustomerRepository customerRepository,
        IUnitOfWork unitOfWork)
    {
        _customerRepository = customerRepository;
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IActionResult> GetCustomers(CancellationToken cancellationToken)
    {
        var customers = await _customerRepository.GetAllActiveAsync(cancellationToken);
        
        var response = customers.Select(c => new CustomerResponse(
            c.Id,
            c.Name,
            c.Email,
            c.Phone,
            c.Address,
            c.IsActive,
            c.CreatedAt));

        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCustomerById(Guid id, CancellationToken cancellationToken)
    {
        var customer = await _customerRepository.GetByIdAsync(id, cancellationToken);

        if (customer is null)
        {
            return NotFound(CustomerErrors.NotFound);
        }

        var response = new CustomerResponse(
            customer.Id,
            customer.Name,
            customer.Email,
            customer.Phone,
            customer.Address,
            customer.IsActive,
            customer.CreatedAt);

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCustomer(
        [FromBody] CreateCustomerRequest request,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrEmpty(request.Email))
        {
            var existingCustomer = await _customerRepository.GetByEmailAsync(request.Email, cancellationToken);

            if (existingCustomer is not null)
            {
                return BadRequest(CustomerErrors.DuplicateEmail);
            }
        }

        var customer = Customer.Create(
            request.Name,
            request.Email,
            request.Phone,
            request.Address);

        _customerRepository.Add(customer);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetCustomerById), new { id = customer.Id }, customer.Id);
    }
}

public sealed record CustomerResponse(
    Guid Id,
    string Name,
    string? Email,
    string? Phone,
    string? Address,
    bool IsActive,
    DateTime CreatedAt);

public sealed record CreateCustomerRequest(
    string Name,
    string? Email,
    string? Phone,
    string? Address);
