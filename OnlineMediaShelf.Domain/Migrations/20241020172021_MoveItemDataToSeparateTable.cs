using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;

#nullable disable

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Migrations
{
    /// <inheritdoc />
    public partial class MoveItemDataToSeparateTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Items_Barcode",
                table: "Items");

            migrationBuilder.AddColumn<Guid>(
                name: "DataId",
                table: "Items",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.CreateTable(
                name: "ItemData",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Version = table.Column<int>(type: "int", nullable: false),
                    Barcode = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Title = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Authors = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CoverImage = table.Column<byte[]>(type: "longblob", nullable: true),
                    ReleaseDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Format = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemData", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.Sql(@"
INSERT INTO ItemData (Version, Barcode, Title, Description, Authors, CoverImage, ReleaseDate, Format)
SELECT 1, Barcode, Title, Description, Authors, CoverImage, ReleaseDate, Format FROM Items;
UPDATE Items
SET DataId = (SELECT ItemData.Id 
              FROM ItemData
              WHERE ItemData.Barcode = Items.Barcode);");

            migrationBuilder.DropColumn(
                name: "Authors",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Barcode",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "CoverImage",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Format",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "ReleaseDate",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Items");

            migrationBuilder.CreateIndex(
                name: "IX_Items_DataId",
                table: "Items",
                column: "DataId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemData_Barcode_Version",
                table: "ItemData",
                columns: new[] { "Barcode", "Version" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Items_ItemData_DataId",
                table: "Items",
                column: "DataId",
                principalTable: "ItemData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_ItemData_DataId",
                table: "Items");

            migrationBuilder.DropTable(
                name: "ItemData");

            migrationBuilder.DropIndex(
                name: "IX_Items_DataId",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "DataId",
                table: "Items");

            migrationBuilder.AddColumn<string>(
                name: "Authors",
                table: "Items",
                type: "varchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Barcode",
                table: "Items",
                type: "varchar(64)",
                maxLength: 64,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<byte[]>(
                name: "CoverImage",
                table: "Items",
                type: "longblob",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Items",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Format",
                table: "Items",
                type: "varchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReleaseDate",
                table: "Items",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Items",
                type: "varchar(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Items_Barcode",
                table: "Items",
                column: "Barcode",
                unique: true);
        }
    }
}
