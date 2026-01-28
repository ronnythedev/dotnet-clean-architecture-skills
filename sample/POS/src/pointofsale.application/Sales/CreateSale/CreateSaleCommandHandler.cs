using pointofsale.application.Abstractions.Messaging;
using pointofsale.domain.Abstractions;
using pointofsale.domain.Products;
using pointofsale.domain.Sales;

namespace pointofsale.application.Sales.CreateSale;

internal sealed class CreateSaleCommandHandler : ICommandHandler<CreateSaleCommand, Guid>
{
    private readonly ISaleRepository _saleRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateSaleCommandHandler(
        ISaleRepository saleRepository,
        IProductRepository productRepository,
        IUnitOfWork unitOfWork)
    {
        _saleRepository = saleRepository;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(
        CreateSaleCommand request,
        CancellationToken cancellationToken)
    {
        var sale = Sale.Create(request.CustomerId, request.PaymentMethod);

        foreach (var item in request.Items)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId, cancellationToken);

            if (product is null)
            {
                return Result.Failure<Guid>(ProductErrors.NotFound);
            }

            // Check stock
            if (product.StockQuantity < item.Quantity)
            {
                return Result.Failure<Guid>(ProductErrors.InsufficientStock);
            }

            sale.AddItem(
                product.Id,
                product.Name,
                product.Price,
                item.Quantity);

            // Reduce stock
            product.AdjustStock(-item.Quantity);
        }

        // Complete the sale
        var completeResult = sale.Complete();
        if (completeResult.IsFailure)
        {
            return Result.Failure<Guid>(completeResult.Error);
        }

        _saleRepository.Add(sale);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return sale.Id;
    }
}
