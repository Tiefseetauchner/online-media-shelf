using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Migrations
{
    /// <inheritdoc />
    public partial class DropBarcodeIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ItemData_Barcode_Version",
                table: "ItemData");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ItemData_Barcode_Version",
                table: "ItemData",
                columns: new[] { "Barcode", "Version" },
                unique: true);
        }
    }
}
