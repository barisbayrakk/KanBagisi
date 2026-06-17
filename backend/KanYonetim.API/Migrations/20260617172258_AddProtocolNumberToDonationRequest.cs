using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KanYonetim.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProtocolNumberToDonationRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProtocolNumber",
                table: "DonationRequests",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "DonationApplications",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "VerificationCode",
                table: "DonationApplications",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProtocolNumber",
                table: "DonationRequests");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "DonationApplications");

            migrationBuilder.DropColumn(
                name: "VerificationCode",
                table: "DonationApplications");
        }
    }
}
