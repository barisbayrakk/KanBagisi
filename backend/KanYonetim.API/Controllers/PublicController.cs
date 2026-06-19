using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KanYonetim.API.Data;
using KanYonetim.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace KanYonetim.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class PublicController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PublicController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("home-stats")]
        public async Task<IActionResult> GetHomeStats()
        {
            // 1. Toplam Aktif İstekler
            var activeRequestsCount = await _context.DonationRequests
                .Where(r => r.Status == "Active" || r.Status == "Approved")
                .CountAsync();

            // 2. Toplam Bağışçı
            var totalDonorsCount = await _context.Users
                .Where(u => u.Role == "Donor")
                .CountAsync();

            // 3. Kan Gruplarının Sayımı
            var bloodTypesCount = await _context.BloodTypes.CountAsync();

            // 4. Kurtarılan Hayatlar (Formülü kullanarak: Tamamlanan İstekler * 3)
            var completedRequestsCount = await _context.DonationRequests
                .Where(r => r.Status == "Fulfilled")
                .CountAsync();
            var livesSaved = completedRequestsCount * 3;

            // 5. Kan Grubu İhtiyaç Dağılımı (Çörek Tablosu İçin)
            var bloodGroupStats = (await _context.DonationRequests
                .Where(r => r.Status == "Active" || r.Status == "Approved")
                .Include(r => r.BloodType)
                .GroupBy(r => r.BloodType!.Name)
                .Select(g => new
                {
                    Name = g.Key,
                    Value = g.Count()
                })
                .OrderByDescending(x => x.Value)
                .Take(5)
                .ToListAsync()).Cast<dynamic>().ToList();

            return Ok(new
            {
                activeRequestsCount,
                totalDonorsCount,
                bloodTypesCount,
                livesSaved,
                bloodGroupStats
            });
        }

        [HttpGet("urgent-requests")]
        public async Task<IActionResult> GetUrgentRequests()
        {
            var urgentRequests = (await _context.DonationRequests
                .Where(r => r.Status == "Active" || r.Status == "Approved")
                .Include(r => r.BloodType)
                .Include(r => r.Hospital)
                .OrderByDescending(r => r.UrgencyLevel == "Acil" ? 2 : (r.UrgencyLevel == "Kritik" ? 3 : 1)) // Kritik > Acil > Normal
                .ThenByDescending(r => r.CreatedAt)
                .Take(5)
                .Select(r => new
                {
                    BloodType = r.BloodType!.Name,
                    Hospital = r.Hospital!.Name,
                    Urgency = r.UrgencyLevel,
                    Distance = "Bilinmiyor", // Since we are not asking for user location on public page
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync()).Cast<dynamic>().ToList();

            return Ok(urgentRequests);
        }

        private static readonly Dictionary<string, Dictionary<string, int>> DefaultStockSeeds = new()
        {
            { "Adalar", new() { { "0+", 2 }, { "0-", 1 }, { "A+", 3 }, { "A-", 0 }, { "B+", 1 }, { "B-", 0 }, { "AB+", 1 }, { "AB-", 0 } } },
            { "Arnavutköy", new() { { "0+", 4 }, { "0-", 2 }, { "A+", 3 }, { "A-", 1 }, { "B+", 5 }, { "B-", 0 }, { "AB+", 2 }, { "AB-", 0 } } },
            { "Ataşehir", new() { { "0+", 15 }, { "0-", 6 }, { "A+", 22 }, { "A-", 5 }, { "B+", 12 }, { "B-", 3 }, { "AB+", 8 }, { "AB-", 2 } } },
            { "Avcılar", new() { { "0+", 8 }, { "0-", 3 }, { "A+", 12 }, { "A-", 2 }, { "B+", 7 }, { "B-", 1 }, { "AB+", 4 }, { "AB-", 0 } } },
            { "Bağcılar", new() { { "0+", 25 }, { "0-", 10 }, { "A+", 32 }, { "A-", 8 }, { "B+", 18 }, { "B-", 4 }, { "AB+", 11 }, { "AB-", 3 } } },
            { "Bahçelievler", new() { { "0+", 18 }, { "0-", 7 }, { "A+", 24 }, { "A-", 6 }, { "B+", 14 }, { "B-", 3 }, { "AB+", 9 }, { "AB-", 2 } } },
            { "Bakırköy", new() { { "0+", 30 }, { "0-", 12 }, { "A+", 40 }, { "A-", 10 }, { "B+", 25 }, { "B-", 5 }, { "AB+", 15 }, { "AB-", 4 } } },
            { "Başakşehir", new() { { "0+", 12 }, { "0-", 4 }, { "A+", 18 }, { "A-", 3 }, { "B+", 10 }, { "B-", 2 }, { "AB+", 6 }, { "AB-", 1 } } },
            { "Bayrampaşa", new() { { "0+", 9 }, { "0-", 2 }, { "A+", 14 }, { "A-", 3 }, { "B+", 8 }, { "B-", 1 }, { "AB+", 5 }, { "AB-", 0 } } },
            { "Beşiktaş", new() { { "0+", 45 }, { "0-", 18 }, { "A+", 52 }, { "A-", 15 }, { "B+", 35 }, { "B-", 8 }, { "AB+", 22 }, { "AB-", 6 } } },
            { "Beykoz", new() { { "0+", 5 }, { "0-", 2 }, { "A+", 8 }, { "A-", 1 }, { "B+", 4 }, { "B-", 0 }, { "AB+", 2 }, { "AB-", 0 } } },
            { "Beylikdüzü", new() { { "0+", 14 }, { "0-", 5 }, { "A+", 19 }, { "A-", 4 }, { "B+", 11 }, { "B-", 2 }, { "AB+", 7 }, { "AB-", 1 } } },
            { "Beyoğlu", new() { { "0+", 22 }, { "0-", 8 }, { "A+", 28 }, { "A-", 7 }, { "B+", 16 }, { "B-", 4 }, { "AB+", 10 }, { "AB-", 3 } } },
            { "Büyükçekmece", new() { { "0+", 6 }, { "0-", 2 }, { "A+", 9 }, { "A-", 1 }, { "B+", 5 }, { "B-", 0 }, { "AB+", 3 }, { "AB-", 0 } } },
            { "Çatalca", new() { { "0+", 2 }, { "0-", 0 }, { "A+", 4 }, { "A-", 0 }, { "B+", 2 }, { "B-", 0 }, { "AB+", 1 }, { "AB-", 0 } } },
            { "Çekmeköy", new() { { "0+", 7 }, { "0-", 2 }, { "A+", 11 }, { "A-", 2 }, { "B+", 6 }, { "B-", 1 }, { "AB+", 3 }, { "AB-", 0 } } },
            { "Esenler", new() { { "0+", 13 }, { "0-", 4 }, { "A+", 17 }, { "A-", 3 }, { "B+", 9 }, { "B-", 2 }, { "AB+", 5 }, { "AB-", 1 } } },
            { "Esenyurt", new() { { "0+", 20 }, { "0-", 8 }, { "A+", 26 }, { "A-", 6 }, { "B+", 15 }, { "B-", 3 }, { "AB+", 9 }, { "AB-", 2 } } },
            { "Eyüpsultan", new() { { "0+", 11 }, { "0-", 3 }, { "A+", 16 }, { "A-", 4 }, { "B+", 9 }, { "B-", 2 }, { "AB+", 6 }, { "AB-", 1 } } },
            { "Fatih", new() { { "0+", 40 }, { "0-", 15 }, { "A+", 48 }, { "A-", 12 }, { "B+", 30 }, { "B-", 7 }, { "AB+", 18 }, { "AB-", 5 } } },
            { "Gaziosmanpaşa", new() { { "0+", 10 }, { "0-", 3 }, { "A+", 15 }, { "A-", 3 }, { "B+", 8 }, { "B-", 2 }, { "AB+", 5 }, { "AB-", 1 } } },
            { "Güngören", new() { { "0+", 8 }, { "0-", 2 }, { "A+", 13 }, { "A-", 2 }, { "B+", 7 }, { "B-", 1 }, { "AB+", 4 }, { "AB-", 0 } } },
            { "Kadıköy", new() { { "0+", 50 }, { "0-", 20 }, { "A+", 60 }, { "A-", 18 }, { "B+", 40 }, { "B-", 10 }, { "AB+", 25 }, { "AB-", 8 } } },
            { "Kağıthane", new() { { "0+", 12 }, { "0-", 4 }, { "A+", 17 }, { "A-", 4 }, { "B+", 10 }, { "B-", 2 }, { "AB+", 6 }, { "AB-", 1 } } },
            { "Kartal", new() { { "0+", 28 }, { "0-", 11 }, { "A+", 35 }, { "A-", 9 }, { "B+", 22 }, { "B-", 5 }, { "AB+", 13 }, { "AB-", 4 } } },
            { "Küçükçekmece", new() { { "0+", 16 }, { "0-", 6 }, { "A+", 22 }, { "A-", 5 }, { "B+", 13 }, { "B-", 3 }, { "AB+", 8 }, { "AB-", 2 } } },
            { "Maltepe", new() { { "0+", 24 }, { "0-", 9 }, { "A+", 30 }, { "A-", 8 }, { "B+", 19 }, { "B-", 4 }, { "AB+", 11 }, { "AB-", 3 } } },
            { "Pendik", new() { { "0+", 32 }, { "0-", 13 }, { "A+", 42 }, { "A-", 11 }, { "B+", 26 }, { "B-", 6 }, { "AB+", 16 }, { "AB-", 4 } } },
            { "Sancaktepe", new() { { "0+", 9 }, { "0-", 3 }, { "A+", 13 }, { "A-", 2 }, { "B+", 8 }, { "B-", 1 }, { "AB+", 5 }, { "AB-", 0 } } },
            { "Sarıyer", new() { { "0+", 18 }, { "0-", 7 }, { "A+", 23 }, { "A-", 6 }, { "B+", 14 }, { "B-", 3 }, { "AB+", 9 }, { "AB-", 2 } } },
            { "Silivri", new() { { "0+", 4 }, { "0-", 1 }, { "A+", 6 }, { "A-", 1 }, { "B+", 3 }, { "B-", 0 }, { "AB+", 2 }, { "AB-", 0 } } },
            { "Sultanbeyli", new() { { "0+", 8 }, { "0-", 2 }, { "A+", 11 }, { "A-", 2 }, { "B+", 6 }, { "B-", 1 }, { "AB+", 4 }, { "AB-", 0 } } },
            { "Sultangazi", new() { { "0+", 11 }, { "0-", 4 }, { "A+", 15 }, { "A-", 3 }, { "B+", 9 }, { "B-", 2 }, { "AB+", 5 }, { "AB-", 1 } } },
            { "Şile", new() { { "0+", 1 }, { "0-", 0 }, { "A+", 2 }, { "A-", 0 }, { "B+", 1 }, { "B-", 0 }, { "AB+", 0 }, { "AB-", 0 } } },
            { "Şişli", new() { { "0+", 42 }, { "0-", 16 }, { "A+", 50 }, { "A-", 14 }, { "B+", 32 }, { "B-", 8 }, { "AB+", 20 }, { "AB-", 5 } } },
            { "Tuzla", new() { { "0+", 12 }, { "0-", 4 }, { "A+", 16 }, { "A-", 4 }, { "B+", 10 }, { "B-", 2 }, { "AB+", 6 }, { "AB-", 1 } } },
            { "Ümraniye", new() { { "0+", 30 }, { "0-", 12 }, { "A+", 38 }, { "A-", 10 }, { "B+", 24 }, { "B-", 5 }, { "AB+", 15 }, { "AB-", 4 } } },
            { "Üsküdar", new() { { "0+", 38 }, { "0-", 15 }, { "A+", 46 }, { "A-", 12 }, { "B+", 29 }, { "B-", 7 }, { "AB+", 17 }, { "AB-", 4 } } },
            { "Zeytinburnu", new() { { "0+", 14 }, { "0-", 5 }, { "A+", 19 }, { "A-", 4 }, { "B+", 11 }, { "B-", 2 }, { "AB+", 7 }, { "AB-", 1 } } }
        };

        [HttpGet("stocks")]
        public async Task<IActionResult> GetStocks()
        {
            var districts = await _context.Districts.ToListAsync();
            var bloodTypes = await _context.BloodTypes.ToListAsync();
            var hospitals = await _context.Hospitals.ToListAsync();

            var dbChanged = false;
            foreach (var district in districts)
            {
                var hasHospital = hospitals.Any(h => h.DistrictId == district.Id);
                if (!hasHospital)
                {
                    var newHospital = new Hospital
                    {
                        Name = $"{district.Name} İlçe Devlet Hastanesi",
                        DistrictId = district.Id,
                        Address = $"{district.Name}, İstanbul",
                        Phone = "0212 000 00 00"
                    };
                    _context.Hospitals.Add(newHospital);
                    hospitals.Add(newHospital);
                    dbChanged = true;
                }
            }
            if (dbChanged)
            {
                await _context.SaveChangesAsync();
            }

            dbChanged = false;
            var stocks = await _context.BloodStocks.ToListAsync();
            foreach (var hospital in hospitals)
            {
                foreach (var bloodType in bloodTypes)
                {
                    var hasStock = stocks.Any(s => s.HospitalId == hospital.Id && s.BloodTypeId == bloodType.Id);
                    if (!hasStock)
                    {
                        int defaultUnits = 0;
                        var cleanName = hospital.Name.Replace(" İlçe Devlet Hastanesi", "");
                        if (DefaultStockSeeds.TryGetValue(cleanName, out var districtSeed))
                        {
                            districtSeed.TryGetValue(bloodType.Name, out defaultUnits);
                        }
                        else
                        {
                            var districtName = districts.FirstOrDefault(d => d.Id == hospital.DistrictId)?.Name;
                            if (districtName != null && DefaultStockSeeds.TryGetValue(districtName, out var dSeed))
                            {
                                dSeed.TryGetValue(bloodType.Name, out defaultUnits);
                            }
                        }

                        var newStock = new BloodStock
                        {
                            HospitalId = hospital.Id,
                            BloodTypeId = bloodType.Id,
                            Units = defaultUnits,
                            LastUpdated = DateTime.UtcNow
                        };
                        _context.BloodStocks.Add(newStock);
                        stocks.Add(newStock);
                        dbChanged = true;
                    }
                }
            }
            if (dbChanged)
            {
                await _context.SaveChangesAsync();
            }

            var response = new Dictionary<string, Dictionary<string, int>>();
            foreach (var district in districts)
            {
                var districtHospital = hospitals.FirstOrDefault(h => h.DistrictId == district.Id);
                if (districtHospital == null) continue;

                var districtStocks = stocks.Where(s => s.HospitalId == districtHospital.Id).ToList();
                var btDict = new Dictionary<string, int>();
                foreach (var bloodType in bloodTypes)
                {
                    var unitStock = districtStocks.FirstOrDefault(s => s.BloodTypeId == bloodType.Id);
                    btDict[bloodType.Name] = unitStock?.Units ?? 0;
                }
                response[district.Name] = btDict;
            }

            return Ok(response);
        }
    }
}
