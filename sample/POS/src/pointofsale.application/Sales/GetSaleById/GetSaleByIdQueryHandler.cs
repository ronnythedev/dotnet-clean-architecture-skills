using pointofsale.application.Abstractions.Messaging;
using pointofsale.domain.Abstractions;
using pointofsale.domain.Sales;

namespace pointofsale.application.Sales.GetSaleById;

internal sealed class GetSaleByIdQueryHandler : IQueryHandler<GetSaleByIdQuery, SaleResponse>
{
    private readonly ISaleRepository _saleRepository;

    public GetSaleByIdQueryHandler(ISaleRepository saleRepository)
    {
        _saleRepository = saleRepository;
    }

    public async Task<Result<SaleResponse>> Handle(
        GetSaleByIdQuery request,
        CancellationToken cancellationToken)
    {
        var sale = await _saleRepository.GetByIdWithItemsAsync(request.SaleId, cancellationToken);

        if (sale is null)
        {
            return Result.Failure<SaleResponse>(SaleErrors.NotFound);
        }

        var response = new SaleResponse(
            sale.Id,
            sale.CustomerId,
            sale.PaymentMethod,
            sale.Subtotal,
            sale.TaxAmount,
            sale.DiscountAmount,
            sale.TotalAmount,
            sale.Status.ToString(),
            sale.CreatedAt,
            sale.CompletedAt,
            sale.Items.Select(i => new SaleItemResponse(
                i.Id,
                i.ProductId,
                i.ProductName,
                i.UnitPrice,
                i.Quantity,
                i.TotalPrice)).ToList());

        return response;
    }
}
