using System.Security.Claims;
using KanYonetim.API.Data;
using KanYonetim.API.Models.DTOs;
using KanYonetim.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanYonetim.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DonorController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IDonationEligibilityService _eligibilityService;
        private readonly IDistanceService _distanceService;

        public DonorController(AppDbContext context, IDonationEligibilityService eligibilityService, IDistanceService distanceService)
        {
            _context = context;
            _eligibilityService = eligibilityService;
            _distanceService = distanceService;
        }

        [HttpGet("eligibility")]
        public async Task<ActionResult<EligibilityDto>> GetEligibility()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            return _eligibilityService.GetEligibility(user);
        }

        [HttpGet("nearby-requests")]
        public async Task<ActionResult<IEnumerable<NearbyRequestDto>>> GetNearbyRequests()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _context.Users
                .Include(u => u.District)
                .FirstOrDefaultAsync(u => u.Id == userId);
            
            if (user == null || user.District == null) return BadRequest("Kullanıcı bilgileri eksik.");

            var activeRequests = await _context.DonationRequests
                .Include(r => r.Hospital)
                    .ThenInclude(h => h!.District)
                .Include(r => r.BloodType)
                .Where(r => r.Status == "Active" && r.BloodTypeId == user.BloodTypeId)
                .ToListAsync();

            var nearbyRequests = activeRequests.Select(r => new NearbyRequestDto
            {
                Id = r.Id,
                HospitalName = r.Hospital!.Name,
                DistrictName = r.Hospital.District!.Name,
                BloodTypeName = r.BloodType!.Name,
                UnitsNeeded = r.UnitsNeeded,
                UrgencyLevel = r.UrgencyLevel,
                CreatedAt = r.CreatedAt,
                DistanceKm = _distanceService.CalculateDistance(
                    user.District.Latitude, user.District.Longitude,
                    r.Hospital.District.Latitude, r.Hospital.District.Longitude)
            })
            .OrderBy(r => r.DistanceKm)
            .ToList();

            return nearbyRequests;
        }

        [HttpGet("profile")]
        public async Task<ActionResult> GetProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _context.Users
                .Include(u => u.District)
                .Include(u => u.BloodType)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound();

            return Ok(new {
                user.FullName,
                user.Email,
                user.Gender,
                BloodType = user.BloodType?.Name,
                District = user.District?.Name,
                user.LastDonationDate
            });
        }

        [HttpGet("monthly-stats")]
        public async Task<ActionResult> GetMonthlyStats()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var today = DateTime.UtcNow;
            var startDate = DateTime.SpecifyKind(new DateTime(today.Year, today.Month, 1).AddMonths(-5), DateTimeKind.Utc);

            var applications = await _context.DonationApplications
                .Where(a => a.DonorId == userId && a.ApplicationDate >= startDate)
                .Select(a => a.ApplicationDate)
                .ToListAsync();

            var requests = await _context.DonationRequests
                .Where(r => r.CreatedAt >= startDate)
                .Select(r => r.CreatedAt)
                .ToListAsync();

            var monthlyStats = new List<object>();
            var turkishMonths = new[] { "Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara" };

            for (int i = 0; i < 6; i++)
            {
                var monthDate = startDate.AddMonths(i);
                var monthName = turkishMonths[monthDate.Month - 1];

                var appCount = applications.Count(a => a.Year == monthDate.Year && a.Month == monthDate.Month);
                var reqCount = requests.Count(r => r.Year == monthDate.Year && r.Month == monthDate.Month);

                monthlyStats.Add(new
                {
                    Name = monthName,
                    Bagis = appCount,
                    Talep = reqCount
                });
            }

            return Ok(monthlyStats);
        }
    }
}
