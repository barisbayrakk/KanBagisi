using KanYonetim.API.Data;
using KanYonetim.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanYonetim.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserListDto>>> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.BloodType)
                .Include(u => u.District)
                .Select(u => new UserListDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Tc = u.Tc,
                    Phone = u.Phone,
                    Role = u.Role,
                    BloodTypeName = u.BloodType != null ? u.BloodType.Name : "",
                    DistrictName = u.District != null ? u.District.Name : "",
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return users;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<StatsDto>> GetStats()
        {
            var today = DateTime.UtcNow.Date;
            
            var stats = new StatsDto
            {
                TotalUsers = await _context.Users.CountAsync(),
                TotalDonors = await _context.Users.CountAsync(u => u.Role == "Kullanıcı" || u.Role == "Donor"),
                TotalHospitals = await _context.Hospitals.CountAsync(),
                ActiveRequests = await _context.DonationRequests.CountAsync(r => r.Status == "Active"),
                TotalApplications = await _context.DonationApplications.CountAsync(),
                TotalDonationsCompleted = await _context.DonationApplications.CountAsync(a => a.Status == "Approved"),
                TodayApplications = await _context.DonationApplications.CountAsync(a => a.ApplicationDate >= today),
                CriticalBloodTypeCount = await _context.DonationRequests.CountAsync(r => r.UrgencyLevel == "Acil" || r.UrgencyLevel == "Kritik"),
                PendingApprovals = await _context.RequestApprovals.CountAsync(a => a.Status == "Pending"),
                DailySystemTraffic = new Random().Next(150, 500) // Mock for now
            };

            // Blood Type Distribution
            var btDist = await _context.Users
                .Where(u => u.BloodType != null)
                .GroupBy(u => u.BloodType.Name)
                .Select(g => new BloodTypeChartDto { Name = g.Key, Value = g.Count() })
                .ToListAsync();
            stats.BloodTypeDistribution = btDist;

            // District Demand
            var distDemand = await _context.DonationRequests
                .Include(r => r.Hospital)
                .ThenInclude(h => h.District)
                .Where(r => r.Hospital != null && r.Hospital.District != null)
                .GroupBy(r => r.Hospital.District.Name)
                .Select(g => new DistrictChartDto { Name = g.Key, Demand = g.Count() })
                .Take(5)
                .ToListAsync();
            stats.DistrictDemand = distDemand;

            // Daily Applications (Last 7 days)
            var last7Days = Enumerable.Range(0, 7).Select(i => today.AddDays(-i)).ToList();
            var appData = await _context.DonationApplications
                .Where(a => a.ApplicationDate >= today.AddDays(-7))
                .GroupBy(a => a.ApplicationDate.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToListAsync();

            stats.DailyApplications = last7Days.Select(d => new ApplicationChartDto
            {
                Date = d.ToString("dd MMM"),
                Applications = appData.FirstOrDefault(a => a.Date == d)?.Count ?? new Random().Next(1, 10) // Mock if 0
            }).Reverse().ToList();

            return stats;
        }

        [HttpDelete("users/{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("audit-logs")]
        public async Task<ActionResult<IEnumerable<object>>> GetAuditLogs()
        {
            var logs = await _context.AuditLogs
                .Include(a => a.User)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new
                {
                    a.Id,
                    UserName = a.User != null ? a.User.FullName : "Sistem",
                    a.ActionType,
                    a.EntityName,
                    a.Description,
                    a.IpAddress,
                    a.CreatedAt
                })
                .Take(100)
                .ToListAsync();

            return Ok(logs);
        }
        [HttpGet("approvals")]
        public async Task<ActionResult<IEnumerable<object>>> GetApprovals()
        {
            var approvals = await _context.RequestApprovals
                .Include(a => a.DonationRequest)
                .ThenInclude(r => r.Hospital)
                .Include(a => a.DonationRequest)
                .ThenInclude(r => r.BloodType)
                .OrderByDescending(a => a.DecidedAt)
                .Select(a => new
                {
                    a.Id,
                    HospitalName = a.DonationRequest != null && a.DonationRequest.Hospital != null ? a.DonationRequest.Hospital.Name : "Bilinmiyor",
                    BloodTypeName = a.DonationRequest != null && a.DonationRequest.BloodType != null ? a.DonationRequest.BloodType.Name : "Bilinmiyor",
                    UnitsNeeded = a.DonationRequest != null ? a.DonationRequest.UnitsNeeded : 0,
                    UrgencyLevel = a.DonationRequest != null ? a.DonationRequest.UrgencyLevel : "Normal",
                    a.Status,
                    a.Notes,
                    a.DecidedAt
                })
                .ToListAsync();
            return Ok(approvals);
        }

        [HttpGet("logistics")]
        public async Task<ActionResult<IEnumerable<object>>> GetLogistics()
        {
            var logistics = await _context.LogisticsTransfers
                .Include(l => l.Hospital)
                .Include(l => l.Courier)
                .OrderByDescending(l => l.CreatedAt)
                .Select(l => new
                {
                    l.Id,
                    HospitalName = l.Hospital != null ? l.Hospital.Name : "Bilinmiyor",
                    CourierName = l.Courier != null ? l.Courier.FullName : "Atanmadı",
                    l.Status,
                    l.EstimatedDelivery,
                    l.CreatedAt
                })
                .ToListAsync();
            return Ok(logistics);
        }

        [HttpGet("security-logs")]
        public async Task<ActionResult<IEnumerable<object>>> GetSecurityLogs()
        {
            var logs = await _context.UserActivityLogs
                .OrderByDescending(l => l.CreatedAt)
                .Take(50)
                .ToListAsync();
            return Ok(logs);
        }
    }
}
