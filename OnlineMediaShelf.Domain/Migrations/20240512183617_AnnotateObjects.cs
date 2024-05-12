using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AnnotateObjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemShelf_Items_ItemsItemId",
                table: "ItemShelf");

            migrationBuilder.DropForeignKey(
                name: "FK_ItemShelf_Shelves_ContainingShelvesShelfId",
                table: "ItemShelf");

            migrationBuilder.DropForeignKey(
                name: "FK_Shelves_AspNetUsers_UserId",
                table: "Shelves");

            migrationBuilder.RenameColumn(
                name: "ShelfId",
                table: "Shelves",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "ItemsItemId",
                table: "ItemShelf",
                newName: "ItemsId");

            migrationBuilder.RenameColumn(
                name: "ContainingShelvesShelfId",
                table: "ItemShelf",
                newName: "ContainingShelvesId");

            migrationBuilder.RenameIndex(
                name: "IX_ItemShelf_ItemsItemId",
                table: "ItemShelf",
                newName: "IX_ItemShelf_ItemsId");

            migrationBuilder.RenameColumn(
                name: "ItemId",
                table: "Items",
                newName: "Id");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Shelves",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemShelf_Items_ItemsId",
                table: "ItemShelf",
                column: "ItemsId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ItemShelf_Shelves_ContainingShelvesId",
                table: "ItemShelf",
                column: "ContainingShelvesId",
                principalTable: "Shelves",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Shelves_AspNetUsers_UserId",
                table: "Shelves",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemShelf_Items_ItemsId",
                table: "ItemShelf");

            migrationBuilder.DropForeignKey(
                name: "FK_ItemShelf_Shelves_ContainingShelvesId",
                table: "ItemShelf");

            migrationBuilder.DropForeignKey(
                name: "FK_Shelves_AspNetUsers_UserId",
                table: "Shelves");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Shelves",
                newName: "ShelfId");

            migrationBuilder.RenameColumn(
                name: "ItemsId",
                table: "ItemShelf",
                newName: "ItemsItemId");

            migrationBuilder.RenameColumn(
                name: "ContainingShelvesId",
                table: "ItemShelf",
                newName: "ContainingShelvesShelfId");

            migrationBuilder.RenameIndex(
                name: "IX_ItemShelf_ItemsId",
                table: "ItemShelf",
                newName: "IX_ItemShelf_ItemsItemId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Items",
                newName: "ItemId");

            migrationBuilder.UpdateData(
                table: "Shelves",
                keyColumn: "UserId",
                keyValue: null,
                column: "UserId",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Shelves",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemShelf_Items_ItemsItemId",
                table: "ItemShelf",
                column: "ItemsItemId",
                principalTable: "Items",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ItemShelf_Shelves_ContainingShelvesShelfId",
                table: "ItemShelf",
                column: "ContainingShelvesShelfId",
                principalTable: "Shelves",
                principalColumn: "ShelfId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Shelves_AspNetUsers_UserId",
                table: "Shelves",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
