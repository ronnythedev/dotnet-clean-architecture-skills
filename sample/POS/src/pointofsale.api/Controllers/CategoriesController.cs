using MediatR;
using Microsoft.AspNetCore.Mvc;
using pointofsale.domain.Categories;
using pointofsale.domain.Abstractions;

namespace pointofsale.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CategoriesController(
        ICategoryRepository categoryRepository,
        IUnitOfWork unitOfWork)
    {
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories(CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetAllActiveAsync(cancellationToken);
        
        var response = categories.Select(c => new CategoryResponse(
            c.Id,
            c.Name,
            c.Description,
            c.IsActive,
            c.CreatedAt));

        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCategoryById(Guid id, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken);

        if (category is null)
        {
            return NotFound(CategoryErrors.NotFound);
        }

        var response = new CategoryResponse(
            category.Id,
            category.Name,
            category.Description,
            category.IsActive,
            category.CreatedAt);

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory(
        [FromBody] CreateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var existingCategory = await _categoryRepository.GetByNameAsync(request.Name, cancellationToken);

        if (existingCategory is not null)
        {
            return BadRequest(CategoryErrors.DuplicateName);
        }

        var category = Category.Create(request.Name, request.Description);

        _categoryRepository.Add(category);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category.Id);
    }
}

public sealed record CategoryResponse(
    Guid Id,
    string Name,
    string? Description,
    bool IsActive,
    DateTime CreatedAt);

public sealed record CreateCategoryRequest(
    string Name,
    string? Description);
