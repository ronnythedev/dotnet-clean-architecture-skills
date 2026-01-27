namespace pointofsale.application.Abstractions.Email;

public interface IEmailService
{
    Task SendEmailAsync(
        string to,
        string subject,
        string body,
        CancellationToken cancellationToken = default);

    Task SendSaleConfirmationAsync(
        string to,
        Guid saleId,
        decimal totalAmount,
        CancellationToken cancellationToken = default);
}
