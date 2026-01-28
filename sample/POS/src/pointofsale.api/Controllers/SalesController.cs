using MediatR;
using Microsoft.AspNetCore.Mvc;
using pointofsale.application.Sales.CreateSale;
using pointofsale.application.Sales.GetSaleById;

namespace pointofsale.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly ISender _sender;

    public SalesController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetSaleById(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetSaleByIdQuery(id);
        var result = await _sender.Send(query, cancellationToken);

        if (result.IsFailure)
        {
            return NotFound(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<IActionResult> CreateSale(
        [FromBody] CreateSaleRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateSaleCommand(
            request.CustomerId,
            request.PaymentMethod,
            request.Items.Select(i => new CreateSaleItemRequest(i.ProductId, i.Quantity)).ToList());

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return CreatedAtAction(nameof(GetSaleById), new { id = result.Value }, result.Value);
    }
}

public sealed record CreateSaleRequest(
    Guid? CustomerId,
    string PaymentMethod,
    List<SaleItemRequest> Items);

public sealed record SaleItemRequest(
    Guid ProductId,
    int Quantity);
