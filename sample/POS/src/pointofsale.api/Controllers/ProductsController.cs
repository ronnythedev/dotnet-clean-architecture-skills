using MediatR;
using Microsoft.AspNetCore.Mvc;
using pointofsale.application.Products.CreateProduct;
using pointofsale.application.Products.GetProducts;

namespace pointofsale.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ISender _sender;

    public ProductsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts(CancellationToken cancellationToken)
    {
        var query = new GetProductsQuery();
        var result = await _sender.Send(query, cancellationToken);

        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct(
        [FromBody] CreateProductRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateProductCommand(
            request.Name,
            request.Sku,
            request.Description,
            request.Price,
            request.Cost,
            request.StockQuantity,
            request.CategoryId);

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return CreatedAtAction(nameof(GetProducts), new { id = result.Value }, result.Value);
    }
}

public sealed record CreateProductRequest(
    string Name,
    string Sku,
    string? Description,
    decimal Price,
    decimal Cost,
    int StockQuantity,
    Guid CategoryId);
