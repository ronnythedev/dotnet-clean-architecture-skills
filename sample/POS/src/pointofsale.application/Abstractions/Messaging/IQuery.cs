using MediatR;
using pointofsale.domain.Abstractions;

namespace pointofsale.application.Abstractions.Messaging;

public interface IQuery<TResponse> : IRequest<Result<TResponse>> { }
