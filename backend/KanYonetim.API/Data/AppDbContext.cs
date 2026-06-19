using Microsoft.EntityFrameworkCore;
using KanYonetim.API.Models;

namespace KanYonetim.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<BloodType> BloodTypes => Set<BloodType>();
        public DbSet<District> Districts => Set<District>();
        public DbSet<Hospital> Hospitals => Set<Hospital>();
        public DbSet<BloodStock> BloodStocks => Set<BloodStock>();
        public DbSet<DonationRequest> DonationRequests => Set<DonationRequest>();
        public DbSet<DonationApplication> DonationApplications => Set<DonationApplication>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<RequestApproval> RequestApprovals => Set<RequestApproval>();
        public DbSet<LogisticsTransfer> LogisticsTransfers => Set<LogisticsTransfer>();
        public DbSet<StockTransfer> StockTransfers => Set<StockTransfer>();
        public DbSet<UserActivityLog> UserActivityLogs => Set<UserActivityLog>();
        public DbSet<ProfileActivityLog> ProfileActivityLogs => Set<ProfileActivityLog>();
        public DbSet<SupportTicket> SupportTickets => Set<SupportTicket>();
        public DbSet<SupportMessage> SupportMessages => Set<SupportMessage>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<BloodStock>()
                .HasIndex(bs => new { bs.HospitalId, bs.BloodTypeId }).IsUnique();

            // Tohum Kan Türleri
            modelBuilder.Entity<BloodType>().HasData(
                new BloodType { Id = 1, Name = "A+" },
                new BloodType { Id = 2, Name = "A-" },
                new BloodType { Id = 3, Name = "B+" },
                new BloodType { Id = 4, Name = "B-" },
                new BloodType { Id = 5, Name = "AB+" },
                new BloodType { Id = 6, Name = "AB-" },
                new BloodType { Id = 7, Name = "0+" },
                new BloodType { Id = 8, Name = "0-" }
            );

            // Tohum İstanbul İlçeleri (yaklaşık merkez koordinatlarıyla 39 ilçe)
            modelBuilder.Entity<District>().HasData(
                new District { Id = 1, Name = "Adalar", Latitude = 40.8761, Longitude = 29.0901 },
                new District { Id = 2, Name = "Arnavutköy", Latitude = 41.1848, Longitude = 28.7394 },
                new District { Id = 3, Name = "Ataşehir", Latitude = 40.9833, Longitude = 29.1167 },
                new District { Id = 4, Name = "Avcılar", Latitude = 40.9796, Longitude = 28.7217 },
                new District { Id = 5, Name = "Bağcılar", Latitude = 41.0393, Longitude = 28.8572 },
                new District { Id = 6, Name = "Bahçelievler", Latitude = 41.0020, Longitude = 28.8614 },
                new District { Id = 7, Name = "Bakırköy", Latitude = 40.9819, Longitude = 28.8769 },
                new District { Id = 8, Name = "Başakşehir", Latitude = 41.0936, Longitude = 28.7944 },
                new District { Id = 9, Name = "Bayrampaşa", Latitude = 41.0467, Longitude = 28.9022 },
                new District { Id = 10, Name = "Beşiktaş", Latitude = 41.0422, Longitude = 29.0067 },
                new District { Id = 11, Name = "Beykoz", Latitude = 41.1167, Longitude = 29.1000 },
                new District { Id = 12, Name = "Beylikdüzü", Latitude = 41.0050, Longitude = 28.6428 },
                new District { Id = 13, Name = "Beyoğlu", Latitude = 41.0369, Longitude = 28.9767 },
                new District { Id = 14, Name = "Büyükçekmece", Latitude = 41.0200, Longitude = 28.5856 },
                new District { Id = 15, Name = "Çatalca", Latitude = 41.1433, Longitude = 28.4600 },
                new District { Id = 16, Name = "Çekmeköy", Latitude = 41.0333, Longitude = 29.1833 },
                new District { Id = 17, Name = "Esenler", Latitude = 41.0436, Longitude = 28.8761 },
                new District { Id = 18, Name = "Esenyurt", Latitude = 41.0333, Longitude = 28.6833 },
                new District { Id = 19, Name = "Eyüpsultan", Latitude = 41.0486, Longitude = 28.9344 },
                new District { Id = 20, Name = "Fatih", Latitude = 41.0186, Longitude = 28.9397 },
                new District { Id = 21, Name = "Gaziosmanpaşa", Latitude = 41.0667, Longitude = 28.9167 },
                new District { Id = 22, Name = "Güngören", Latitude = 41.0203, Longitude = 28.8764 },
                new District { Id = 23, Name = "Kadıköy", Latitude = 40.9928, Longitude = 29.0264 },
                new District { Id = 24, Name = "Kağıthane", Latitude = 41.0783, Longitude = 28.9714 },
                new District { Id = 25, Name = "Kartal", Latitude = 40.9064, Longitude = 29.1886 },
                new District { Id = 26, Name = "Küçükçekmece", Latitude = 41.0000, Longitude = 28.7833 },
                new District { Id = 27, Name = "Maltepe", Latitude = 40.9333, Longitude = 29.1333 },
                new District { Id = 28, Name = "Pendik", Latitude = 40.8761, Longitude = 29.2547 },
                new District { Id = 29, Name = "Sancaktepe", Latitude = 41.0000, Longitude = 29.2333 },
                new District { Id = 30, Name = "Sarıyer", Latitude = 41.1667, Longitude = 29.0500 },
                new District { Id = 31, Name = "Silivri", Latitude = 41.0736, Longitude = 28.2461 },
                new District { Id = 32, Name = "Sultanbeyli", Latitude = 40.9597, Longitude = 29.2617 },
                new District { Id = 33, Name = "Sultangazi", Latitude = 41.1067, Longitude = 28.8669 },
                new District { Id = 34, Name = "Şile", Latitude = 41.1756, Longitude = 29.6133 },
                new District { Id = 35, Name = "Şişli", Latitude = 41.0600, Longitude = 28.9872 },
                new District { Id = 36, Name = "Tuzla", Latitude = 40.8167, Longitude = 29.3000 },
                new District { Id = 37, Name = "Ümraniye", Latitude = 41.0167, Longitude = 29.1167 },
                new District { Id = 38, Name = "Üsküdar", Latitude = 41.0236, Longitude = 29.0153 },
                new District { Id = 39, Name = "Zeytinburnu", Latitude = 41.0042, Longitude = 28.9069 }
            );

            // Tohum Hastaneleri (bölgeler arası örnek hastaneler)
            modelBuilder.Entity<Hospital>().HasData(
                new Hospital { Id = 1, Name = "İstanbul Üniversitesi Tıp Fakültesi", DistrictId = 20, Address = "Çapa, Fatih", Phone = "0212 414 00 00" },
                new Hospital { Id = 2, Name = "Haydarpaşa Numune Hastanesi", DistrictId = 38, Address = "Selimiye, Üsküdar", Phone = "0216 414 45 02" },
                new Hospital { Id = 3, Name = "Şişli Hamidiye Etfal Hastanesi", DistrictId = 35, Address = "Halaskargazi Cd., Şişli", Phone = "0212 373 50 00" },
                new Hospital { Id = 4, Name = "Kartal Dr. Lütfi Kırdar Hastanesi", DistrictId = 25, Address = "Cevizli, Kartal", Phone = "0216 441 39 00" },
                new Hospital { Id = 5, Name = "Bakırköy Dr. Sadi Konuk Hastanesi", DistrictId = 7, Address = "Zuhuratbaba, Bakırköy", Phone = "0212 414 71 71" },
                new Hospital { Id = 6, Name = "Başakşehir Çam ve Sakura Hastanesi", DistrictId = 8, Address = "Başakşehir", Phone = "0212 909 60 00" },
                new Hospital { Id = 7, Name = "Kadıköy Devlet Hastanesi", DistrictId = 23, Address = "Caferağa, Kadıköy", Phone = "0216 346 57 57" },
                new Hospital { Id = 8, Name = "Pendik Devlet Hastanesi", DistrictId = 28, Address = "Batı, Pendik", Phone = "0216 585 05 05" },
                new Hospital { Id = 9, Name = "Beyoğlu Devlet Hastanesi", DistrictId = 13, Address = "Kulaksız, Beyoğlu", Phone = "0212 252 43 00" },
                new Hospital { Id = 10, Name = "Ümraniye Eğitim Araştırma Hastanesi", DistrictId = 37, Address = "Elmalıkent, Ümraniye", Phone = "0216 632 18 18" }
            );
        }
    }
}
