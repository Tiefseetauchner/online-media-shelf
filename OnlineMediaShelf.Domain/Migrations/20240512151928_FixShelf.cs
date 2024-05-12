using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Migrations
{
    /// <inheritdoc />
    public partial class FixShelf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shelves_AspNetUsers_ApplicationUserId",
                table: "Shelves");

            migrationBuilder.DropIndex(
                name: "IX_Shelves_ApplicationUserId",
                table: "Shelves");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Shelves");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Shelves",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Shelves_UserId",
                table: "Shelves",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shelves_AspNetUsers_UserId",
                table: "Shelves",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shelves_AspNetUsers_UserId",
                table: "Shelves");

            migrationBuilder.DropIndex(
                name: "IX_Shelves_UserId",
                table: "Shelves");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Shelves",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "Shelves",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Shelves_ApplicationUserId",
                table: "Shelves",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shelves_AspNetUsers_ApplicationUserId",
                table: "Shelves",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
