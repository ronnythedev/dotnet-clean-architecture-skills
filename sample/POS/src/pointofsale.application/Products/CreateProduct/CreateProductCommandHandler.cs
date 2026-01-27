using pointofsale.application.Abstractions.Messaging;
using pointofsale.domain.Abstractions;
using pointofsale.domain.Products;

namespace pointofsale.application.Products.CreateProduct;

internal sealed class CreateProductCommandHandler : ICommandHandler<CreateProductCommand, Guid>
{
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateProductCommandHandler(
        IProductRepository productRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(
        CreateProductCommand request,
        CancellationToken cancellationToken)
    {
        var existingProduct = await _productRepository.GetBySkuAsync(request.Sku, cancellationToken);

        if (existingProduct is not null)
        {
            return Result.Failure<Guid>(ProductErrors.DuplicateSku);
        }

        var product = Product.Create(
            request.Name,
            request.Sku,
            request.Description,
            request.Price,
            request.Cost,
            request.StockQuantity,
            request.CategoryId);

        _productRepository.Add(product);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return product.Id;
    }
}
