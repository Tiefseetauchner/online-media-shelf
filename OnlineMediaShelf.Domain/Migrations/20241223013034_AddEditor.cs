using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddEditor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EditorId",
                table: "ItemData",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemData_AspNetUsers_EditorId",
                table: "ItemData");

            migrationBuilder.DropIndex(
                name: "IX_ItemData_EditorId",
                table: "ItemData");

            migrationBuilder.DropColumn(
                name: "EditorId",
                table: "ItemData");
        }
    }
}
