using System.Security.Claims;
using KanYonetim.API.Data;
using KanYonetim.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanYonetim.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DonationApplicationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DonationApplicationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult> Apply(int requestId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            
            var existingApplication = await _context.DonationApplications
                .FirstOrDefaultAsync(a => a.DonorId == userId && a.DonationRequestId == requestId);
            
            if (existingApplication != null) return BadRequest("Bu talep için zaten başvurunuz bulunmaktadır.");

            var user = await _context.Users.FindAsync(userId);
            if (user?.LastDonationDate.HasValue == true)
            {
                int waitDays = user.Gender == "Kadın" ? 120 : 90;
                var nextEligibleDate = user.LastDonationDate.Value.AddDays(waitDays);
                if (DateTime.UtcNow < nextEligibleDate)
                {
                    var formattedNextDate = nextEligibleDate.ToString("dd MMMM yyyy", new System.Globalization.CultureInfo("tr-TR"));
                    return BadRequest($"Bağış yapabilmek için yasal bekleme süreniz henüz dolmamıştır. Bir sonraki bağış tarihiniz: {formattedNextDate}");
                }
            }

            var random = new Random();
            var verificationCode = $"DONOR-{random.Next(1000, 9999)}";

            var application = new DonationApplication
                {
                    DonorId = userId,
                    DonationRequestId = requestId,
                    Status = "Pending",
                    VerificationCode = verificationCode,
                    IsApproved = false,
                    ApplicationDate = DateTime.UtcNow
                };

            _context.DonationApplications.Add(application);

            // Etkinlik günlüğü
            try
            {
                var reqInfo = await _context.DonationRequests
                    .Include(r => r.BloodType)
                    .FirstOrDefaultAsync(r => r.Id == requestId);
                string bloodType = reqInfo?.BloodType?.Name ?? "";
                string desc = string.IsNullOrEmpty(bloodType) 
                    ? "Yeni kan talebine başvurdun." 
                    : $"{bloodType} kan bağışı talebine başvurdun.";

                var activityLog = new ProfileActivityLog
                {
                    UserId = userId,
                    ActionType = "DonationApplied",
                    Description = desc,
                    CreatedAt = DateTime.UtcNow
                };
                _context.ProfileActivityLogs.Add(activityLog);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Activity Log Error] Failed to log donation application activity: {ex.Message}");
            }

            await _context.SaveChangesAsync();
            return Ok(application);
        }

        [HttpGet("my-applications")]
        public async Task<ActionResult> GetMyApplications()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var applications = await _context.DonationApplications
                .Include(a => a.DonationRequest)
                    .ThenInclude(r => r!.Hospital)
                .Include(a => a.DonationRequest)
                    .ThenInclude(r => r!.BloodType)
                .Where(a => a.DonorId == userId)
                .OrderByDescending(a => a.ApplicationDate)
                .ToListAsync();

            return Ok(applications);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Hospital,Admin")]
        public async Task<ActionResult> UpdateStatus(int id, string status)
        {
            var application = await _context.DonationApplications
                .Include(a => a.Donor)
                .Include(a => a.DonationRequest)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null) return NotFound();

            application.Status = status;

            if (status == "Approved")
            {
                // Başvuru onaylanırsa/tamamlanırsa bağışçının son bağış tarihini güncelleyin
                if (application.Donor != null)
                {
                    application.Donor.LastDonationDate = DateTime.UtcNow;
                }

                // Etkinlik günlüğü
                try
                {
                    var activityLog = new ProfileActivityLog
                    {
                        UserId = application.DonorId,
                        ActionType = "DonationApproved",
                        Description = "Kan bağışınız başarıyla tamamlandı ve onaylandı.",
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.ProfileActivityLogs.Add(activityLog);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Activity Log Error] Failed to log donation approval activity: {ex.Message}");
                }
            }
            else if (status == "Rejected")
            {
                // Etkinlik günlüğü
                try
                {
                    var activityLog = new ProfileActivityLog
                    {
                        UserId = application.DonorId,
                        ActionType = "DonationRejected",
                        Description = "Kan bağışı başvurunuz reddedildi.",
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.ProfileActivityLogs.Add(activityLog);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Activity Log Error] Failed to log donation rejection activity: {ex.Message}");
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("verify")]
        [Authorize(Roles = "Hospital,Admin")]
        public async Task<ActionResult> VerifyDonation([FromBody] KanYonetim.API.Models.DTOs.VerifyDonationRequestDto dto)
        {
            var application = await _context.DonationApplications
                .Include(a => a.Donor)
                .Include(a => a.DonationRequest)
                .FirstOrDefaultAsync(a => a.VerificationCode == dto.VerificationCode && a.DonationRequest!.ProtocolNumber == dto.ProtocolNumber);

            if (application == null) return NotFound("Doğrulama kodu veya protokol numarası eşleşmedi.");

            if (application.IsApproved) return BadRequest("Bu bağış zaten onaylanmış.");

            application.IsApproved = true;
            application.Status = "Approved";

            if (application.Donor != null)
            {
                application.Donor.LastDonationDate = DateTime.UtcNow;
            }

            // Onaylanmış bağış için bir denetim günlüğü oluşturun
            _context.AuditLogs.Add(new AuditLog
            {
                UserId = application.DonorId,
                ActionType = "DonationVerification",
                EntityName = "DonationApplication",
                EntityId = application.Id.ToString(),
                IpAddress = "System", // Or HttpContext.Connection.RemoteIpAddress?.ToString()
                Description = $"Bağış başarıyla hastane tarafından doğrulandı. Protokol: {dto.ProtocolNumber}, Kod: {dto.VerificationCode}",
                CreatedAt = DateTime.UtcNow
            });

            // Etkinlik günlüğü
            try
            {
                var activityLog = new ProfileActivityLog
                {
                    UserId = application.DonorId,
                    ActionType = "DonationApproved",
                    Description = "Kan bağışınız başarıyla tamamlandı ve onaylandı.",
                    CreatedAt = DateTime.UtcNow
                };
                _context.ProfileActivityLogs.Add(activityLog);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Activity Log Error] Failed to log donation verification activity: {ex.Message}");
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Kan bağışı başarıyla doğrulandı." });
        }
    }
}
