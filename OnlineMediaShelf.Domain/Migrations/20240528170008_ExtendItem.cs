using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tiefseetauchner.OnlineMediaShelf.Domain.Migrations
{
    /// <inheritdoc />
    public partial class ExtendItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Authors",
                table: "Items",
                type: "varchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "[]")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<byte[]>(
                name: "CoverImage",
                table: "Items",
                type: "longblob",
                nullable: true);

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Authors",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "CoverImage",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Format",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "ReleaseDate",
                table: "Items");
        }
    }
}
