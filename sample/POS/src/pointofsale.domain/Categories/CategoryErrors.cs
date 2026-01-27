using pointofsale.domain.Abstractions;

namespace pointofsale.domain.Categories;

public static class CategoryErrors
{
    public static readonly Error NotFound = new(
        "Category.NotFound",
        "The category with the specified identifier was not found");

    public static readonly Error DuplicateName = new(
        "Category.DuplicateName",
        "A category with this name already exists");

    public static readonly Error HasProducts = new(
        "Category.HasProducts",
        "Cannot delete category that has associated products");
}
