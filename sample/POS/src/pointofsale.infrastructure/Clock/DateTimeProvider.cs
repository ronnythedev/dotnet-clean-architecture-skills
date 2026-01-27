namespace pointofsale.infrastructure.Clock;

using pointofsale.application.Abstractions.Clock;

internal sealed class DateTimeProvider : IDateTimeProvider
{
    public DateTime UtcNow => DateTime.UtcNow;
}
