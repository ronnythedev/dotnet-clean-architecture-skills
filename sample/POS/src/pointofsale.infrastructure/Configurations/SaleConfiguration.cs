using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using pointofsale.domain.Sales;

namespace pointofsale.infrastructure.Configurations;

internal sealed class SaleConfiguration : IEntityTypeConfiguration<Sale>
{
    public void Configure(EntityTypeBuilder<Sale> builder)
    {
        builder.ToTable("sales");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.PaymentMethod)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(s => s.Subtotal)
            .HasPrecision(18, 2);

        builder.Property(s => s.TaxAmount)
            .HasPrecision(18, 2);

        builder.Property(s => s.DiscountAmount)
            .HasPrecision(18, 2);

        builder.Property(s => s.TotalAmount)
            .HasPrecision(18, 2);

        builder.Property(s => s.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasOne<pointofsale.domain.Customers.Customer>()
            .WithMany()
            .HasForeignKey(s => s.CustomerId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(s => s.Items)
            .WithOne()
            .HasForeignKey(i => i.SaleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
