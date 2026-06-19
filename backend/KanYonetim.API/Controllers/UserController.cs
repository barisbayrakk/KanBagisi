using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KanYonetim.API.Data;
using KanYonetim.API.Models;
using KanYonetim.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace KanYonetim.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (claim != null && int.TryParse(claim.Value, out int userId))
            {
                return userId;
            }
            throw new Exception("Kullanıcı kimliği bulunamadı.");
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                int userId = GetUserId();
                var user = await _context.Users
                    .Include(u => u.BloodType)
                    .Include(u => u.District)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null) return NotFound("Kullanıcı bulunamadı.");

                var profileDto = new UserProfileDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Tc = user.Tc,
                    Phone = user.Phone,
                    Gender = user.Gender,
                    Role = user.Role,
                    BloodType = user.BloodType?.Name ?? "",
                    BloodTypeId = user.BloodTypeId,
                    District = user.District?.Name ?? "",
                    DistrictId = user.DistrictId,
                    IsEmailVerified = user.IsEmailVerified,
                    DateOfBirth = user.DateOfBirth,
                    Weight = user.Weight,
                    Title = user.Title,
                    HasChronicDisease = user.HasChronicDisease,
                    UsesMedication = user.UsesMedication,
                    RecentAlcoholUse = user.RecentAlcoholUse,
                    RecentSurgery = user.RecentSurgery,
                    EmergencyContactName = user.EmergencyContactName,
                    EmergencyContactRelation = user.EmergencyContactRelation,
                    EmergencyContactPhone = user.EmergencyContactPhone,
                    City = user.City,
                    Neighborhood = user.Neighborhood,
                    NearestHospital = user.NearestHospital,
                    ProfileVisibility = user.ProfileVisibility,
                    AllowPhoneShare = user.AllowPhoneShare,
                    EmailNotifications = user.EmailNotifications,
                    SmsNotifications = user.SmsNotifications,
                    LocationBasedNotifications = user.LocationBasedNotifications,
                    TwoFactorEnabled = user.TwoFactorEnabled,
                    IsPhoneVerified = user.IsPhoneVerified,
                    ProfileCompletionRate = user.ProfileCompletionRate,
                    LastDonationDate = user.LastDonationDate
                };

                return Ok(profileDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto dto)
        {
            try
            {
                int userId = GetUserId();
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null) return NotFound("Kullanıcı bulunamadı.");

                // Tamamlanma Oranını Hesapla
                int completedFields = 0;
                int totalFields = 8; // FullName, TC, Phone, BloodType, District, Weight, DateOfBirth, EmergencyContact

                if (!string.IsNullOrEmpty(dto.FullName)) completedFields++;
                if (!string.IsNullOrEmpty(dto.Tc)) completedFields++;
                if (!string.IsNullOrEmpty(dto.Phone)) completedFields++;
                if (dto.BloodTypeId > 0) completedFields++;
                if (dto.DistrictId > 0) completedFields++;
                if (dto.Weight.HasValue && dto.Weight > 0) completedFields++;
                if (dto.DateOfBirth.HasValue) completedFields++;
                if (!string.IsNullOrEmpty(dto.EmergencyContactName)) completedFields++;

                int completionRate = (int)Math.Round((double)completedFields / totalFields * 100);

                // Alanları Güncelle
                user.FullName = dto.FullName;
                user.Tc = dto.Tc;
                user.Phone = dto.Phone;
                user.Gender = dto.Gender;
                
                // Sadece yöneticilerin piyasadaki etkileri
                if (user.Role == "Admin")
                {
                    user.BloodTypeId = dto.BloodTypeId;
                }
                
                user.DistrictId = dto.DistrictId;
                user.DateOfBirth = dto.DateOfBirth;
                user.Weight = dto.Weight;
                user.Title = dto.Title;
                user.HasChronicDisease = dto.HasChronicDisease;
                user.UsesMedication = dto.UsesMedication;
                user.RecentAlcoholUse = dto.RecentAlcoholUse;
                user.RecentSurgery = dto.RecentSurgery;
                user.EmergencyContactName = dto.EmergencyContactName;
                user.EmergencyContactRelation = dto.EmergencyContactRelation;
                user.EmergencyContactPhone = dto.EmergencyContactPhone;
                user.City = dto.City;
                user.Neighborhood = dto.Neighborhood;
                user.NearestHospital = dto.NearestHospital;
                user.ProfileVisibility = dto.ProfileVisibility;
                user.AllowPhoneShare = dto.AllowPhoneShare;
                user.EmailNotifications = dto.EmailNotifications;
                user.SmsNotifications = dto.SmsNotifications;
                user.LocationBasedNotifications = dto.LocationBasedNotifications;
                user.TwoFactorEnabled = dto.TwoFactorEnabled;
                user.ProfileCompletionRate = completionRate;

                // Etkinlik Günlüğü Oluştur
                var activityLog = new ProfileActivityLog
                {
                    UserId = user.Id,
                    ActionType = "ProfileUpdated",
                    Description = "Profil bilgileri güncellendi.",
                    CreatedAt = DateTime.UtcNow
                };

                _context.ProfileActivityLogs.Add(activityLog);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Profil başarıyla güncellendi.", completionRate });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("activities")]
        public async Task<IActionResult> GetActivities()
        {
            try
            {
                int userId = GetUserId();
                var logs = await _context.ProfileActivityLogs
                    .Where(l => l.UserId == userId)
                    .OrderByDescending(l => l.CreatedAt)
                    .Take(10)
                    .Select(l => new ProfileActivityLogDto
                    {
                        Id = l.Id,
                        ActionType = l.ActionType,
                        Description = l.Description,
                        CreatedAt = l.CreatedAt
                    })
                    .ToListAsync();

                return Ok(logs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            try
            {
                int userId = GetUserId();
                var notifications = await _context.Notifications
                    .Where(n => n.UserId == userId)
                    .OrderByDescending(n => n.CreatedAt)
                    .ToListAsync();
                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("notifications/{id}/read")]
        public async Task<IActionResult> MarkNotificationAsRead(int id)
        {
            try
            {
                int userId = GetUserId();
                var notification = await _context.Notifications
                    .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
                
                if (notification == null) return NotFound("Bildirim bulunamadı.");
                
                notification.IsRead = true;
                await _context.SaveChangesAsync();
                
                return Ok(new { message = "Bildirim okundu olarak işaretlendi." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("notifications/read-all")]
        public async Task<IActionResult> MarkAllNotificationsAsRead()
        {
            try
            {
                int userId = GetUserId();
                var notifications = await _context.Notifications
                    .Where(n => n.UserId == userId && !n.IsRead)
                    .ToListAsync();
                
                foreach (var n in notifications)
                {
                    n.IsRead = true;
                }
                
                await _context.SaveChangesAsync();
                return Ok(new { message = "Tüm bildirimler okundu olarak işaretlendi." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
