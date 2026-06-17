using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace KanYonetim.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialPostgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BloodTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Districts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Longitude = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Districts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Gender = table.Column<string>(type: "text", nullable: false),
                    BloodTypeId = table.Column<int>(type: "integer", nullable: false),
                    DistrictId = table.Column<int>(type: "integer", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    LastDonationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_BloodTypes_BloodTypeId",
                        column: x => x.BloodTypeId,
                        principalTable: "BloodTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Users_Districts_DistrictId",
                        column: x => x.DistrictId,
                        principalTable: "Districts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Hospitals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    DistrictId = table.Column<int>(type: "integer", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    Phone = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hospitals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Hospitals_Districts_DistrictId",
                        column: x => x.DistrictId,
                        principalTable: "Districts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Hospitals_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "BloodStocks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HospitalId = table.Column<int>(type: "integer", nullable: false),
                    BloodTypeId = table.Column<int>(type: "integer", nullable: false),
                    Units = table.Column<int>(type: "integer", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodStocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BloodStocks_BloodTypes_BloodTypeId",
                        column: x => x.BloodTypeId,
                        principalTable: "BloodTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BloodStocks_Hospitals_HospitalId",
                        column: x => x.HospitalId,
                        principalTable: "Hospitals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DonationRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HospitalId = table.Column<int>(type: "integer", nullable: false),
                    BloodTypeId = table.Column<int>(type: "integer", nullable: false),
                    UnitsNeeded = table.Column<int>(type: "integer", nullable: false),
                    UrgencyLevel = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonationRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DonationRequests_BloodTypes_BloodTypeId",
                        column: x => x.BloodTypeId,
                        principalTable: "BloodTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DonationRequests_Hospitals_HospitalId",
                        column: x => x.HospitalId,
                        principalTable: "Hospitals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DonationApplications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DonorId = table.Column<int>(type: "integer", nullable: false),
                    DonationRequestId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    ApplicationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonationApplications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DonationApplications_DonationRequests_DonationRequestId",
                        column: x => x.DonationRequestId,
                        principalTable: "DonationRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DonationApplications_Users_DonorId",
                        column: x => x.DonorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "BloodTypes",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "A+" },
                    { 2, "A-" },
                    { 3, "B+" },
                    { 4, "B-" },
                    { 5, "AB+" },
                    { 6, "AB-" },
                    { 7, "0+" },
                    { 8, "0-" }
                });

            migrationBuilder.InsertData(
                table: "Districts",
                columns: new[] { "Id", "Latitude", "Longitude", "Name" },
                values: new object[,]
                {
                    { 1, 40.876100000000001, 29.0901, "Adalar" },
                    { 2, 41.184800000000003, 28.7394, "Arnavutköy" },
                    { 3, 40.9833, 29.116700000000002, "Ataşehir" },
                    { 4, 40.979599999999998, 28.721699999999998, "Avcılar" },
                    { 5, 41.039299999999997, 28.857199999999999, "Bağcılar" },
                    { 6, 41.002000000000002, 28.8614, "Bahçelievler" },
                    { 7, 40.981900000000003, 28.876899999999999, "Bakırköy" },
                    { 8, 41.093600000000002, 28.7944, "Başakşehir" },
                    { 9, 41.046700000000001, 28.902200000000001, "Bayrampaşa" },
                    { 10, 41.042200000000001, 29.006699999999999, "Beşiktaş" },
                    { 11, 41.116700000000002, 29.100000000000001, "Beykoz" },
                    { 12, 41.005000000000003, 28.642800000000001, "Beylikdüzü" },
                    { 13, 41.036900000000003, 28.976700000000001, "Beyoğlu" },
                    { 14, 41.020000000000003, 28.585599999999999, "Büyükçekmece" },
                    { 15, 41.143300000000004, 28.460000000000001, "Çatalca" },
                    { 16, 41.033299999999997, 29.183299999999999, "Çekmeköy" },
                    { 17, 41.043599999999998, 28.876100000000001, "Esenler" },
                    { 18, 41.033299999999997, 28.683299999999999, "Esenyurt" },
                    { 19, 41.0486, 28.9344, "Eyüpsultan" },
                    { 20, 41.018599999999999, 28.939699999999998, "Fatih" },
                    { 21, 41.066699999999997, 28.916699999999999, "Gaziosmanpaşa" },
                    { 22, 41.020299999999999, 28.8764, "Güngören" },
                    { 23, 40.992800000000003, 29.026399999999999, "Kadıköy" },
                    { 24, 41.078299999999999, 28.971399999999999, "Kağıthane" },
                    { 25, 40.906399999999998, 29.188600000000001, "Kartal" },
                    { 26, 41.0, 28.783300000000001, "Küçükçekmece" },
                    { 27, 40.933300000000003, 29.133299999999998, "Maltepe" },
                    { 28, 40.876100000000001, 29.2547, "Pendik" },
                    { 29, 41.0, 29.2333, "Sancaktepe" },
                    { 30, 41.166699999999999, 29.050000000000001, "Sarıyer" },
                    { 31, 41.073599999999999, 28.246099999999998, "Silivri" },
                    { 32, 40.959699999999998, 29.261700000000001, "Sultanbeyli" },
                    { 33, 41.106699999999996, 28.866900000000001, "Sultangazi" },
                    { 34, 41.175600000000003, 29.613299999999999, "Şile" },
                    { 35, 41.060000000000002, 28.987200000000001, "Şişli" },
                    { 36, 40.816699999999997, 29.300000000000001, "Tuzla" },
                    { 37, 41.0167, 29.116700000000002, "Ümraniye" },
                    { 38, 41.023600000000002, 29.0153, "Üsküdar" },
                    { 39, 41.004199999999997, 28.9069, "Zeytinburnu" }
                });

            migrationBuilder.InsertData(
                table: "Hospitals",
                columns: new[] { "Id", "Address", "DistrictId", "Name", "Phone", "UserId" },
                values: new object[,]
                {
                    { 1, "Çapa, Fatih", 20, "İstanbul Üniversitesi Tıp Fakültesi", "0212 414 00 00", null },
                    { 2, "Selimiye, Üsküdar", 38, "Haydarpaşa Numune Hastanesi", "0216 414 45 02", null },
                    { 3, "Halaskargazi Cd., Şişli", 35, "Şişli Hamidiye Etfal Hastanesi", "0212 373 50 00", null },
                    { 4, "Cevizli, Kartal", 25, "Kartal Dr. Lütfi Kırdar Hastanesi", "0216 441 39 00", null },
                    { 5, "Zuhuratbaba, Bakırköy", 7, "Bakırköy Dr. Sadi Konuk Hastanesi", "0212 414 71 71", null },
                    { 6, "Başakşehir", 8, "Başakşehir Çam ve Sakura Hastanesi", "0212 909 60 00", null },
                    { 7, "Caferağa, Kadıköy", 23, "Kadıköy Devlet Hastanesi", "0216 346 57 57", null },
                    { 8, "Batı, Pendik", 28, "Pendik Devlet Hastanesi", "0216 585 05 05", null },
                    { 9, "Kulaksız, Beyoğlu", 13, "Beyoğlu Devlet Hastanesi", "0212 252 43 00", null },
                    { 10, "Elmalıkent, Ümraniye", 37, "Ümraniye Eğitim Araştırma Hastanesi", "0216 632 18 18", null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_BloodStocks_BloodTypeId",
                table: "BloodStocks",
                column: "BloodTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_BloodStocks_HospitalId_BloodTypeId",
                table: "BloodStocks",
                columns: new[] { "HospitalId", "BloodTypeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DonationApplications_DonationRequestId",
                table: "DonationApplications",
                column: "DonationRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_DonationApplications_DonorId",
                table: "DonationApplications",
                column: "DonorId");

            migrationBuilder.CreateIndex(
                name: "IX_DonationRequests_BloodTypeId",
                table: "DonationRequests",
                column: "BloodTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_DonationRequests_HospitalId",
                table: "DonationRequests",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_Hospitals_DistrictId",
                table: "Hospitals",
                column: "DistrictId");

            migrationBuilder.CreateIndex(
                name: "IX_Hospitals_UserId",
                table: "Hospitals",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_BloodTypeId",
                table: "Users",
                column: "BloodTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_DistrictId",
                table: "Users",
                column: "DistrictId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BloodStocks");

            migrationBuilder.DropTable(
                name: "DonationApplications");

            migrationBuilder.DropTable(
                name: "DonationRequests");

            migrationBuilder.DropTable(
                name: "Hospitals");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "BloodTypes");

            migrationBuilder.DropTable(
                name: "Districts");
        }
    }
}
