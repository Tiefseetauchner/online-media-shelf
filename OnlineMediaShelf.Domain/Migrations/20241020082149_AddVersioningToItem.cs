using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddVersioningToItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemShelf_Items_ItemsId",
                table: "ItemShelf");
            
            migrationBuilder.DropForeignKey(
                name: "FK_ItemShelf_Shelves_ContainingShelvesId",
                table: "ItemShelf");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ItemShelf",
                table: "ItemShelf");

            migrationBuilder.DropIndex(
                name: "IX_ItemShelf_ItemsId",
                table: "ItemShelf");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Items",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Items_Barcode",
                table: "Items");

            migrationBuilder.AddColumn<int>(
                name: "ItemsVersion",
                table: "ItemShelf",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Items",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ItemShelf",
                table: "ItemShelf",
                columns: new[] { "ContainingShelvesId", "ItemsId", "ItemsVersion" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Items",
                table: "Items",
                columns: new[] { "Id", "Version" });

            migrationBuilder.CreateIndex(
                name: "IX_ItemShelf_ItemsId_ItemsVersion",
                table: "ItemShelf",
                columns: new[] { "ItemsId", "ItemsVersion" });

            migrationBuilder.CreateIndex(
                name: "IX_Items_Barcode_Version",
                table: "Items",
                columns: new[] { "Barcode", "Version" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ItemShelf_Items_ItemsId_ItemsVersion",
                table: "ItemShelf",
                columns: new[] { "ItemsId", "ItemsVersion" },
                principalTable: "Items",
                principalColumns: new[] { "Id", "Version" },
                onDelete: ReferentialAction.Cascade);
            
            migrationBuilder.AddForeignKey(
                name: "FK_ItemShelf_Shelves_ContainingShelvesId",
                table: "ItemShelf",
                column: "ContainingShelvesId",
                principalTable: "Shelves",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemShelf_Items_ItemsId_ItemsVersion",
                table: "ItemShelf");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ItemShelf",
                table: "ItemShelf");

            migrationBuilder.DropIndex(
                name: "IX_ItemShelf_ItemsId_ItemsVersion",
                table: "ItemShelf");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Items",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Items_Barcode_Version",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "ItemsVersion",
                table: "ItemShelf");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "Items");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ItemShelf",
                table: "ItemShelf",
                columns: new[] { "ContainingShelvesId", "ItemsId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Items",
                table: "Items",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ItemShelf_ItemsId",
                table: "ItemShelf",
                column: "ItemsId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_Barcode",
                table: "Items",
                column: "Barcode",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ItemShelf_Items_ItemsId",
                table: "ItemShelf",
                column: "ItemsId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
