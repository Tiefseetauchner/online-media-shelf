using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AuthorToOwnTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Authors",
                table: "ItemData");

            migrationBuilder.CreateTable(
                name: "ItemAuthors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemAuthors", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ItemAuthorItemData",
                columns: table => new
                {
                    AuthorsId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    OwnedItemsId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemAuthorItemData", x => new { x.AuthorsId, x.OwnedItemsId });
                    table.ForeignKey(
                        name: "FK_ItemAuthorItemData_ItemAuthors_AuthorsId",
                        column: x => x.AuthorsId,
                        principalTable: "ItemAuthors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemAuthorItemData_ItemData_OwnedItemsId",
                        column: x => x.OwnedItemsId,
                        principalTable: "ItemData",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ItemAuthorItemData_OwnedItemsId",
                table: "ItemAuthorItemData",
                column: "OwnedItemsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemAuthorItemData");

            migrationBuilder.DropTable(
                name: "ItemAuthors");

            migrationBuilder.AddColumn<string>(
                name: "Authors",
                table: "ItemData",
                type: "varchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
