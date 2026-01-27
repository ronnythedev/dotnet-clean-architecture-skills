using MediatR;
using pointofsale.domain.Abstractions;

namespace pointofsale.application.Abstractions.Messaging;

public interface IQueryHandler<TQuery, TResponse> : IRequestHandler<TQuery, Result<TResponse>>
    where TQuery : IQuery<TResponse> { }
