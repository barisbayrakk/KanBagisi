namespace KanYonetim.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Tc { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty; // Erkek, Kadın
        public int BloodTypeId { get; set; }
        public BloodType? BloodType { get; set; }
        public int DistrictId { get; set; }
        public District? District { get; set; }
        public string Role { get; set; } = "Donor"; // Donor, Hospital, Admin
        public DateTime? LastDonationDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsEmailVerified { get; set; } = false;
        public string? EmailVerificationCode { get; set; }

        // --- YENİ PROFİL ALANLARI ---
        public DateTime? DateOfBirth { get; set; }
        public double? Weight { get; set; }
        public string? Title { get; set; } // Görev/Unvan
        
        // Sağlık / Bağış Uygunluğu
        public bool HasChronicDisease { get; set; } = false;
        public bool UsesMedication { get; set; } = false;
        public bool RecentAlcoholUse { get; set; } = false;
        public bool RecentSurgery { get; set; } = false;

        // Acil Durum İletişimi
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactRelation { get; set; }
        public string? EmergencyContactPhone { get; set; }

        // Konum Detayı
        public string? City { get; set; } = "İstanbul";
        public string? Neighborhood { get; set; }
        public string? NearestHospital { get; set; }

        // Ayarlar / Gizlilik / Bildirimler
        public string ProfileVisibility { get; set; } = "Public"; // Public, HospitalOnly, Private
        public bool AllowPhoneShare { get; set; } = true;
        public bool EmailNotifications { get; set; } = true;
        public bool SmsNotifications { get; set; } = true;
        public bool LocationBasedNotifications { get; set; } = true;
        
        // Güvenlik / İlerleme
        public bool TwoFactorEnabled { get; set; } = false;
        public bool IsPhoneVerified { get; set; } = false;
        public int ProfileCompletionRate { get; set; } = 20;

        public ICollection<ProfileActivityLog> ProfileActivityLogs { get; set; } = new List<ProfileActivityLog>();
    }

    public class ProfileActivityLog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public string ActionType { get; set; } = string.Empty; // e.g. "ProfileUpdate", "EmailVerified", "BloodTypeChanged"
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }


    public class BloodType
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ICollection<BloodStock> BloodStocks { get; set; } = new List<BloodStock>();
    }

    public class District
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class Hospital
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int DistrictId { get; set; }
        public District? District { get; set; }
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int? UserId { get; set; }
        public User? User { get; set; }
        public ICollection<BloodStock> BloodStocks { get; set; } = new List<BloodStock>();
        public ICollection<DonationRequest> DonationRequests { get; set; } = new List<DonationRequest>();
    }

    public class BloodStock
    {
        public int Id { get; set; }
        public int HospitalId { get; set; }
        public Hospital? Hospital { get; set; }
        public int BloodTypeId { get; set; }
        public BloodType? BloodType { get; set; }
        public int Units { get; set; }
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }

    public class DonationRequest
    {
        public int Id { get; set; }
        public int HospitalId { get; set; }
        public Hospital? Hospital { get; set; }
        public int BloodTypeId { get; set; }
        public BloodType? BloodType { get; set; }
        public int UnitsNeeded { get; set; }
        public string UrgencyLevel { get; set; } = "Normal"; // Normal, Acil, Kritik
        public string Status { get; set; } = "Active"; // Active, Fulfilled, Cancelled
        public string ProtocolNumber { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<DonationApplication> Applications { get; set; } = new List<DonationApplication>();
    }

    public class DonationApplication
    {
        public int Id { get; set; }
        public int DonorId { get; set; }
        public User? Donor { get; set; }
        public int DonationRequestId { get; set; }
        public DonationRequest? DonationRequest { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public string VerificationCode { get; set; } = string.Empty;
        public bool IsApproved { get; set; } = false;
        public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;
    }

    public class AuditLog
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }
        public string ActionType { get; set; } = string.Empty;
        public string EntityName { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = "Info"; // Info, Warning, Error
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class RequestApproval
    {
        public int Id { get; set; }
        public int DonationRequestId { get; set; }
        public DonationRequest? DonationRequest { get; set; }
        public int AdminId { get; set; }
        public User? Admin { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Spam
        public string Notes { get; set; } = string.Empty;
        public DateTime DecidedAt { get; set; } = DateTime.UtcNow;
    }

    public class LogisticsTransfer
    {
        public int Id { get; set; }
        public int DonationRequestId { get; set; }
        public DonationRequest? DonationRequest { get; set; }
        public int? CourierId { get; set; }
        public User? Courier { get; set; }
        public int HospitalId { get; set; }
        public Hospital? Hospital { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, InTransit, Delivered, Cancelled
        public DateTime? EstimatedDelivery { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class StockTransfer
    {
        public int Id { get; set; }
        public string SenderDistrict { get; set; } = string.Empty;
        public string ReceiverDistrict { get; set; } = string.Empty;
        public string BloodType { get; set; } = string.Empty;
        public int Amount { get; set; }
        public double Distance { get; set; }
        public DateTime TransferDate { get; set; } = DateTime.UtcNow;
    }

    public class UserActivityLog
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public bool IsSuccess { get; set; }
        public string FailureReason { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class SupportTicket
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Status { get; set; } = "Open"; // Open, Answered, Resolved, Closed
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<SupportMessage> Messages { get; set; } = new List<SupportMessage>();
    }

    public class SupportMessage
    {
        public int Id { get; set; }
        public int SupportTicketId { get; set; }
        public SupportTicket? SupportTicket { get; set; }
        public int SenderId { get; set; }
        public User? Sender { get; set; }
        public string MessageText { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
