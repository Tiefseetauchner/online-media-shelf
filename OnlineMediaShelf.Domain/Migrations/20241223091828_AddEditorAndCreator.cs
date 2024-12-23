using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddEditorAndCreator : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatorId",
                table: "Items",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "EditorId",
                table: "ItemData",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Items_CreatorId",
                table: "Items",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemData_EditorId",
                table: "ItemData",
                column: "EditorId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemData_AspNetUsers_EditorId",
                table: "ItemData",
                column: "EditorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_AspNetUsers_CreatorId",
                table: "Items",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemData_AspNetUsers_EditorId",
                table: "ItemData");

            migrationBuilder.DropForeignKey(
                name: "FK_Items_AspNetUsers_CreatorId",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Items_CreatorId",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_ItemData_EditorId",
                table: "ItemData");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "EditorId",
                table: "ItemData");
        }
    }
}
