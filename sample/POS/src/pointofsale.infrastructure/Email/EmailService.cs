using Microsoft.Extensions.Logging;
using pointofsale.application.Abstractions.Email;

namespace pointofsale.infrastructure.Email;

internal sealed class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;

    public EmailService(ILogger<EmailService> logger)
    {
        _logger = logger;
    }

    public async Task SendEmailAsync(
        string to,
        string subject,
        string body,
        CancellationToken cancellationToken = default)
    {
        // TODO: Implement actual email sending (SendGrid, AWS SES, SMTP, etc.)
        // For now, just log the email
        
        _logger.LogInformation(
            "Sending email to {To} with subject: {Subject}",
            to,
            subject);

        // Simulate async email sending
        await Task.Delay(100, cancellationToken);

        _logger.LogInformation(
            "Email sent successfully to {To}",
            to);
    }

    public async Task SendSaleConfirmationAsync(
        string to,
        Guid saleId,
        decimal totalAmount,
        CancellationToken cancellationToken = default)
    {
        var subject = $"Sale Confirmation - Order #{saleId.ToString()[..8].ToUpper()}";
        
        var body = $"""
            Thank you for your purchase!
            
            Order ID: {saleId}
            Total Amount: ${totalAmount:F2}
            
            We appreciate your business!
            
            - Point of Sale Team
            """;

        await SendEmailAsync(to, subject, body, cancellationToken);
    }
}
