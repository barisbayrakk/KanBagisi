using KanYonetim.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanYonetim.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MetadataController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MetadataController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("bloodtypes")]
        public async Task<ActionResult> GetBloodTypes()
        {
            return Ok(await _context.BloodTypes.ToListAsync());
        }

        [HttpGet("districts")]
        public async Task<ActionResult> GetDistricts()
        {
            return Ok(await _context.Districts.OrderBy(d => d.Name).ToListAsync());
        }
    }
}
