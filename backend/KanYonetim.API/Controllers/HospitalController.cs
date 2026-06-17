using System.Security.Claims;
using KanYonetim.API.Data;
using KanYonetim.API.Models;
using KanYonetim.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanYonetim.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class HospitalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HospitalController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("my-hospital")]
        public async Task<ActionResult> GetMyHospital()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var hospital = await _context.Hospitals
                .Include(h => h.District)
                .FirstOrDefaultAsync(h => h.UserId == userId);

            if (hospital == null) return NotFound("Hastane kaydı bulunamadı.");
            return Ok(hospital);
        }

        [HttpGet("{id}/stock")]
        public async Task<ActionResult<IEnumerable<BloodStock>>> GetStock(int id)
        {
            var stock = await _context.BloodStocks
                .Include(s => s.BloodType)
                .Where(s => s.HospitalId == id)
                .ToListAsync();

            return stock;
        }

        [HttpPut("update-stock")]
        public async Task<ActionResult> UpdateStock(UpdateStockDto updateStockDto)
        {
            var stock = await _context.BloodStocks
                .FirstOrDefaultAsync(s => s.HospitalId == updateStockDto.HospitalId && s.BloodTypeId == updateStockDto.BloodTypeId);

            if (stock == null)
            {
                stock = new BloodStock
                {
                    HospitalId = updateStockDto.HospitalId,
                    BloodTypeId = updateStockDto.BloodTypeId,
                    Units = updateStockDto.Units,
                    LastUpdated = DateTime.UtcNow
                };
                _context.BloodStocks.Add(stock);
            }
            else
            {
                stock.Units = updateStockDto.Units;
                stock.LastUpdated = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("create-request")]
        public async Task<ActionResult> CreateRequest(CreateDonationRequestDto requestDto)
        {
            var request = new DonationRequest
            {
                HospitalId = requestDto.HospitalId,
                BloodTypeId = requestDto.BloodTypeId,
                UnitsNeeded = requestDto.UnitsNeeded,
                UrgencyLevel = requestDto.UrgencyLevel,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };

            _context.DonationRequests.Add(request);
            await _context.SaveChangesAsync();
            return Ok(request);
        }

        [HttpGet("my-requests")]
        public async Task<ActionResult> GetMyRequests(int hospitalId)
        {
            var requests = await _context.DonationRequests
                .Include(r => r.BloodType)
                .Include(r => r.Applications)
                .Where(r => r.HospitalId == hospitalId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(requests);
        }
    }
}
