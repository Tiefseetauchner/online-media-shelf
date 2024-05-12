using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Migrations
{
    /// <inheritdoc />
    public partial class ShelfItemManyMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_Shelves_ShelfId",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Items_ShelfId",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "ShelfId",
                table: "Items");

            migrationBuilder.CreateTable(
                name: "ItemShelf",
                columns: table => new
                {
                    ContainingShelvesShelfId = table.Column<int>(type: "int", nullable: false),
                    ItemsItemId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemShelf", x => new { x.ContainingShelvesShelfId, x.ItemsItemId });
                    table.ForeignKey(
                        name: "FK_ItemShelf_Items_ItemsItemId",
                        column: x => x.ItemsItemId,
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemShelf_Shelves_ContainingShelvesShelfId",
                        column: x => x.ContainingShelvesShelfId,
                        principalTable: "Shelves",
                        principalColumn: "ShelfId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ItemShelf_ItemsItemId",
                table: "ItemShelf",
                column: "ItemsItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemShelf");

            migrationBuilder.AddColumn<int>(
                name: "ShelfId",
                table: "Items",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Items_ShelfId",
                table: "Items",
                column: "ShelfId");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_Shelves_ShelfId",
                table: "Items",
                column: "ShelfId",
                principalTable: "Shelves",
                principalColumn: "ShelfId");
        }
    }
}
