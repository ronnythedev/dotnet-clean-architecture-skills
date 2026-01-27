using pointofsale.application.Abstractions.Messaging;
using pointofsale.domain.Abstractions;
using pointofsale.domain.Products;

namespace pointofsale.application.Products.GetProducts;

internal sealed class GetProductsQueryHandler : IQueryHandler<GetProductsQuery, IReadOnlyList<ProductResponse>>
{
    private readonly IProductRepository _productRepository;

    public GetProductsQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<Result<IReadOnlyList<ProductResponse>>> Handle(
        GetProductsQuery request,
        CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetAllActiveAsync(cancellationToken);

        var response = products.Select(p => new ProductResponse(
            p.Id,
            p.Name,
            p.Sku,
            p.Description,
            p.Price,
            p.Cost,
            p.StockQuantity,
            p.CategoryId,
            p.IsActive,
            p.CreatedAt)).ToList();

        return response;
    }
}
