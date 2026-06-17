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
                // Update donor's last donation date if application is approved/completed
                if (application.Donor != null)
                {
                    application.Donor.LastDonationDate = DateTime.UtcNow;
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

            // Create an audit log for approved donation
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

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Kan bağışı başarıyla doğrulandı." });
        }
    }
}
