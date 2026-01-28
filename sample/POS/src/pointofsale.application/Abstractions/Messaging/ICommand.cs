using MediatR;
using pointofsale.domain.Abstractions;

namespace pointofsale.application.Abstractions.Messaging;

public interface ICommand : IRequest<Result> { }

public interface ICommand<TResponse> : IRequest<Result<TResponse>> { }
