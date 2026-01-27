using MediatR;
using Microsoft.Extensions.Logging;
using pointofsale.domain.Abstractions;

namespace pointofsale.application.Abstractions.Behaviors;

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : Result
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var name = request.GetType().Name;

        try
        {
            _logger.LogInformation("Executing request {Request}", name);

            var result = await next();

            if (result.IsSuccess)
            {
                _logger.LogInformation("Request {Request} processed successfully", name);
            }
            else
            {
                _logger.LogWarning(
                    "Request {Request} failed with error {Error}",
                    name,
                    result.Error);
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Request {Request} failed with exception", name);
            throw;
        }
    }
}
