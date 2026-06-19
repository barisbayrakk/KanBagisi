namespace KanYonetim.API.Models.DTOs
{
    // Kimlik Doğrulama DTO'ları
    public class RegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Tc { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public int BloodTypeId { get; set; }
        public int DistrictId { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class GoogleLoginDto
    {
        public string Token { get; set; } = string.Empty;
    }

    public class VerifyEmailDto
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Tc { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string BloodType { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public int UserId { get; set; }
        public bool RequiresEmailVerification { get; set; } = false;
    }

    // Kan Stoku DTO'ları
    public class UpdateStockDto
    {
        public int HospitalId { get; set; }
        public int BloodTypeId { get; set; }
        public int Units { get; set; }
    }

    public class AddDonationDto
    {
        public string Tc { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string BloodType { get; set; } = string.Empty;
        public string Ilce { get; set; } = string.Empty;
        public string Hastane { get; set; } = string.Empty;
    }

    // Bağış Talebi DTO'ları
    public class CreateDonationRequestDto
    {
        public int HospitalId { get; set; }
        public int BloodTypeId { get; set; }
        public int UnitsNeeded { get; set; }
        public string UrgencyLevel { get; set; } = "Normal";
    }

    public class VerifyDonationRequestDto
    {
        public string ProtocolNumber { get; set; } = string.Empty;
        public string VerificationCode { get; set; } = string.Empty;
    }

    // Uygunluk DTO'su
    public class EligibilityDto
    {
        public bool IsEligible { get; set; }
        public DateTime? NextEligibleDate { get; set; }
        public int? DaysRemaining { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    // Yakındaki DTO'yu Talep Et
    public class NearbyRequestDto
    {
        public int Id { get; set; }
        public string HospitalName { get; set; } = string.Empty;
        public string DistrictName { get; set; } = string.Empty;
        public string BloodTypeName { get; set; } = string.Empty;
        public int UnitsNeeded { get; set; }
        public string UrgencyLevel { get; set; } = string.Empty;
        public double DistanceKm { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // İstatistikler DTO
    public class StatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalDonors { get; set; }
        public int TotalHospitals { get; set; }
        public int ActiveRequests { get; set; }
        public int TotalApplications { get; set; }
        public int TotalDonationsCompleted { get; set; }
        public int TodayApplications { get; set; }
        public int CriticalBloodTypeCount { get; set; }
        public int PendingApprovals { get; set; }
        public int DailySystemTraffic { get; set; }
        
        // Grafik Verileri
        public List<BloodTypeChartDto> BloodTypeDistribution { get; set; } = new();
        public List<DistrictChartDto> DistrictDemand { get; set; } = new();
        public List<ApplicationChartDto> DailyApplications { get; set; } = new();
    }

    public class BloodTypeChartDto
    {
        public string Name { get; set; } = string.Empty;
        public int Value { get; set; }
    }

    public class DistrictChartDto
    {
        public string Name { get; set; } = string.Empty;
        public int Demand { get; set; }
    }

    public class ApplicationChartDto
    {
        public string Date { get; set; } = string.Empty;
        public int Applications { get; set; }
    }

    // Kullanıcı Listesi DTO
    public class UserListDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Tc { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string BloodTypeName { get; set; } = string.Empty;
        public string DistrictName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime? LastDonationDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    // Profil DTO'ları
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Tc { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string BloodType { get; set; } = string.Empty;
        public int BloodTypeId { get; set; }
        public string District { get; set; } = string.Empty;
        public int DistrictId { get; set; }
        public bool IsEmailVerified { get; set; }

        public DateTime? DateOfBirth { get; set; }
        public double? Weight { get; set; }
        public string? Title { get; set; }
        
        public bool HasChronicDisease { get; set; }
        public bool UsesMedication { get; set; }
        public bool RecentAlcoholUse { get; set; }
        public bool RecentSurgery { get; set; }

        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactRelation { get; set; }
        public string? EmergencyContactPhone { get; set; }

        public string? City { get; set; }
        public string? Neighborhood { get; set; }
        public string? NearestHospital { get; set; }

        public string ProfileVisibility { get; set; } = string.Empty;
        public bool AllowPhoneShare { get; set; }
        public bool EmailNotifications { get; set; }
        public bool SmsNotifications { get; set; }
        public bool LocationBasedNotifications { get; set; }
        
        public bool TwoFactorEnabled { get; set; }
        public bool IsPhoneVerified { get; set; }
        public int ProfileCompletionRate { get; set; }
        public DateTime? LastDonationDate { get; set; }
    }

    public class UpdateUserProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Tc { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public int BloodTypeId { get; set; }
        public int DistrictId { get; set; }

        public DateTime? DateOfBirth { get; set; }
        public double? Weight { get; set; }
        public string? Title { get; set; }
        
        public bool HasChronicDisease { get; set; }
        public bool UsesMedication { get; set; }
        public bool RecentAlcoholUse { get; set; }
        public bool RecentSurgery { get; set; }

        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactRelation { get; set; }
        public string? EmergencyContactPhone { get; set; }

        public string? City { get; set; }
        public string? Neighborhood { get; set; }
        public string? NearestHospital { get; set; }

        public string ProfileVisibility { get; set; } = "Public";
        public bool AllowPhoneShare { get; set; }
        public bool EmailNotifications { get; set; }
        public bool SmsNotifications { get; set; }
        public bool LocationBasedNotifications { get; set; }
        
        public bool TwoFactorEnabled { get; set; }
    }

    public class ProfileActivityLogDto
    {
        public int Id { get; set; }
        public string ActionType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    // DTO'ları destekleyin
    public class CreateTicketDto
    {
        public string Subject { get; set; } = string.Empty;
        public string MessageText { get; set; } = string.Empty;
    }

    public class CreateMessageDto
    {
        public string MessageText { get; set; } = string.Empty;
    }

    public class UpdateTicketStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }

    public class SupportTicketDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<SupportMessageDto> Messages { get; set; } = new();
    }

    public class SupportMessageDto
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string SenderRole { get; set; } = string.Empty;
        public string MessageText { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
