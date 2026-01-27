using MediatR;
using Microsoft.Extensions.Logging;
using pointofsale.application.Abstractions.Email;
using pointofsale.domain.Customers;
using pointofsale.domain.Sales;

namespace pointofsale.application.Sales.Events;

internal sealed class SaleCompletedDomainEventHandler 
    : INotificationHandler<SaleCompletedDomainEvent>
{
    private readonly ISaleRepository _saleRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly IEmailService _emailService;
    private readonly ILogger<SaleCompletedDomainEventHandler> _logger;

    public SaleCompletedDomainEventHandler(
        ISaleRepository saleRepository,
        ICustomerRepository customerRepository,
        IEmailService emailService,
        ILogger<SaleCompletedDomainEventHandler> logger)
    {
        _saleRepository = saleRepository;
        _customerRepository = customerRepository;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task Handle(
        SaleCompletedDomainEvent notification, 
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Handling SaleCompletedDomainEvent for Sale {SaleId}", 
            notification.SaleId);

        // Get the sale details
        var sale = await _saleRepository.GetByIdWithItemsAsync(
            notification.SaleId, 
            cancellationToken);

        if (sale is null)
        {
            _logger.LogWarning(
                "Sale {SaleId} not found when handling SaleCompletedDomainEvent", 
                notification.SaleId);
            return;
        }

        // If sale has a customer with email, send confirmation
        if (sale.CustomerId.HasValue)
        {
            var customer = await _customerRepository.GetByIdAsync(
                sale.CustomerId.Value, 
                cancellationToken);

            if (customer is not null && !string.IsNullOrEmpty(customer.Email))
            {
                await _emailService.SendSaleConfirmationAsync(
                    customer.Email,
                    sale.Id,
                    sale.TotalAmount,
                    cancellationToken);

                _logger.LogInformation(
                    "Sale confirmation email sent to {Email} for Sale {SaleId}",
                    customer.Email,
                    sale.Id);
            }
        }
    }
}
