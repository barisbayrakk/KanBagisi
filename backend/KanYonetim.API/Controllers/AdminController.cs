using KanYonetim.API.Data;
using KanYonetim.API.Models;
using KanYonetim.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanYonetim.API.Controllers
{
    [Authorize(Roles = "Admin,SubAdmin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("seed-10-users")]
        public async Task<IActionResult> Seed10Users()
        {
            try
            {
                var users = new List<User>();
                var random = new Random();
                var bloodTypes = await _context.BloodTypes.ToListAsync();
                var districts = await _context.Districts.ToListAsync();
                string[] maleNames = { "Ahmet", "Mehmet", "Can", "Ali", "Burak" };
                string[] femaleNames = { "Ayşe", "Fatma", "Elif", "Zeynep", "Merve" };
                string[] surnames = { "Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan" };

                for (int i = 0; i < 5; i++)
                {
                    var bt = bloodTypes[random.Next(bloodTypes.Count)];
                    var dist = districts[random.Next(districts.Count)];
                    users.Add(new User
                    {
                        FullName = maleNames[i] + " " + surnames[random.Next(surnames.Length)],
                        Email = $"test.erkek{i + 1}_{Guid.NewGuid().ToString().Substring(0, 4)}@gmail.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sifre123!"),
                        Tc = $"100{random.Next(10000000, 99999999)}",
                        Phone = "05320000" + random.Next(100, 999).ToString(),
                        Gender = "Erkek",
                        BloodTypeId = bt.Id,
                        DistrictId = dist.Id,
                        Role = "Donor",
                        IsEmailVerified = true,
                        IsPhoneVerified = true,
                        DateOfBirth = new DateTime(1990 + random.Next(10), random.Next(1, 12), random.Next(1, 28), 0, 0, 0, DateTimeKind.Utc),
                        Weight = random.Next(65, 95)
                    });
                }

                for (int i = 0; i < 5; i++)
                {
                    var bt = bloodTypes[random.Next(bloodTypes.Count)];
                    var dist = districts[random.Next(districts.Count)];
                    users.Add(new User
                    {
                        FullName = femaleNames[i] + " " + surnames[random.Next(surnames.Length)],
                        Email = $"test.kadin{i + 1}_{Guid.NewGuid().ToString().Substring(0, 4)}@gmail.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sifre123!"),
                        Tc = $"200{random.Next(10000000, 99999999)}",
                        Phone = "05330000" + random.Next(100, 999).ToString(),
                        Gender = "Kadın",
                        BloodTypeId = bt.Id,
                        DistrictId = dist.Id,
                        Role = "Donor",
                        IsEmailVerified = true,
                        IsPhoneVerified = true,
                        DateOfBirth = new DateTime(1990 + random.Next(10), random.Next(1, 12), random.Next(1, 28), 0, 0, 0, DateTimeKind.Utc),
                        Weight = random.Next(55, 75)
                    });
                }

                _context.Users.AddRange(users);
                await _context.SaveChangesAsync();
                return Ok("10 adet test hesabı (5 erkek, 5 kadın) başarıyla eklendi.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException != null ? ex.InnerException.Message : ex.Message);
            }
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
                    Gender = u.Gender,
                    LastDonationDate = u.LastDonationDate,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return users;
        }

        [HttpPost("add-donation")]
        public async Task<ActionResult> AddDirectDonation([FromBody] AddDonationDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Tc == dto.Tc);
            if (user != null)
            {
                if (user.LastDonationDate.HasValue)
                {
                    int waitDays = user.Gender == "Kadın" ? 120 : 90;
                    var nextEligibleDate = user.LastDonationDate.Value.AddDays(waitDays);
                    if (DateTime.UtcNow < nextEligibleDate)
                    {
                        var formattedNextDate = nextEligibleDate.ToString("dd MMMM yyyy", new System.Globalization.CultureInfo("tr-TR"));
                        return BadRequest($"Bu bağışçının yasal bekleme süresi henüz dolmamıştır! Bir sonraki bağış tarihi: {formattedNextDate}");
                    }
                }

                user.LastDonationDate = DateTime.UtcNow;
                
                // Etkinlik günlüğü ekle
                var activityLog = new ProfileActivityLog
                {
                    UserId = user.Id,
                    ActionType = "DirectDonation",
                    Description = System.Text.Json.JsonSerializer.Serialize(new { Ilce = dto.Ilce, Hastane = dto.Hastane, BloodType = dto.BloodType }),
                    CreatedAt = DateTime.UtcNow
                };
                _context.ProfileActivityLogs.Add(activityLog);

                var auditLog = new AuditLog
                {
                    UserId = user.Id,
                    ActionType = "Create",
                    EntityName = "DirectDonation",
                    Description = $"Yönetici tarafından {user.FullName} ({user.Tc}) adına doğrudan bağış kaydı oluşturuldu.",
                    IpAddress = "System",
                    CreatedAt = DateTime.UtcNow
                };
                _context.AuditLogs.Add(auditLog);

                await _context.SaveChangesAsync();
                return Ok(new { message = "Bağış başarıyla kaydedildi.", lastDonationDate = user.LastDonationDate });
            }
            return NotFound("Bağışçı bulunamadı. Sadece yerel kayıt yapılacaktır.");
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

            // Kan Grubu Dağılımı
            var btDist = await _context.Users
                .Where(u => u.BloodType != null)
                .GroupBy(u => u.BloodType.Name)
                .Select(g => new BloodTypeChartDto { Name = g.Key, Value = g.Count() })
                .ToListAsync();
            stats.BloodTypeDistribution = btDist;

            // Bölge Talebi
            var distDemand = await _context.DonationRequests
                .Include(r => r.Hospital)
                .ThenInclude(h => h.District)
                .Where(r => r.Hospital != null && r.Hospital.District != null)
                .GroupBy(r => r.Hospital.District.Name)
                .Select(g => new DistrictChartDto { Name = g.Key, Demand = g.Count() })
                .Take(5)
                .ToListAsync();
            stats.DistrictDemand = distDemand;

            // Günlük Başvurular (Son 7 gün)
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
                .Include(l => l.DonationRequest).ThenInclude(d => d.BloodType)
                .Select(l => new
                {
                    Id = l.Id,
                    SenderHospital = "Genel Stok (Kızılay)",
                    ReceiverHospital = l.Hospital != null ? l.Hospital.Name : "Bilinmiyor",
                    BloodType = l.DonationRequest != null && l.DonationRequest.BloodType != null ? l.DonationRequest.BloodType.Name : "-",
                    Amount = l.DonationRequest != null ? l.DonationRequest.UnitsNeeded : 0,
                    CourierName = l.Courier != null ? l.Courier.FullName : "Atanmadı",
                    Status = l.Status,
                    EstimatedDelivery = l.EstimatedDelivery,
                    CreatedAt = l.CreatedAt
                })
                .ToListAsync();

            var stockTransfers = await _context.StockTransfers
                .Select(s => new
                {
                    Id = s.Id + 10000,
                    SenderHospital = s.SenderDistrict + " Hastanesi",
                    ReceiverHospital = s.ReceiverDistrict + " Hastanesi",
                    BloodType = s.BloodType,
                    Amount = s.Amount,
                    CourierName = "Sistem Transferi",
                    Status = "Delivered",
                    EstimatedDelivery = (DateTime?)s.TransferDate,
                    CreatedAt = s.TransferDate
                })
                .ToListAsync();

            var combined = logistics
                .Concat(stockTransfers)
                .OrderByDescending(x => x.CreatedAt)
                .ToList();

            return Ok(combined);
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

        [HttpPut("stocks")]
        public async Task<IActionResult> UpdateAllStocks([FromBody] Dictionary<string, Dictionary<string, int>> stockUpdates)
        {
            if (stockUpdates == null) return BadRequest("Geçersiz veri.");

            var districts = await _context.Districts.ToListAsync();
            var bloodTypes = await _context.BloodTypes.ToListAsync();
            var hospitals = await _context.Hospitals.ToListAsync();
            var stocks = await _context.BloodStocks.ToListAsync();

            foreach (var districtEntry in stockUpdates)
            {
                var districtName = districtEntry.Key;
                var district = districts.FirstOrDefault(d => d.Name == districtName);
                if (district == null) continue;

                var hospital = hospitals.FirstOrDefault(h => h.DistrictId == district.Id);
                if (hospital == null) continue;

                foreach (var bloodTypeEntry in districtEntry.Value)
                {
                    var bloodTypeName = bloodTypeEntry.Key;
                    var units = bloodTypeEntry.Value;

                    var bloodType = bloodTypes.FirstOrDefault(bt => bt.Name == bloodTypeName);
                    if (bloodType == null) continue;

                    var stock = stocks.FirstOrDefault(s => s.HospitalId == hospital.Id && s.BloodTypeId == bloodType.Id);
                    if (stock == null)
                    {
                        stock = new BloodStock
                        {
                            HospitalId = hospital.Id,
                            BloodTypeId = bloodType.Id,
                            Units = units,
                            LastUpdated = DateTime.UtcNow
                        };
                        _context.BloodStocks.Add(stock);
                    }
                    else
                    {
                        stock.Units = units;
                        stock.LastUpdated = DateTime.UtcNow;
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Stok bilgileri veri tabanına başarıyla kaydedildi." });
        }

        [HttpGet("stocks")]
        public async Task<ActionResult<Dictionary<string, Dictionary<string, int>>>> GetStocks()
        {
            var districts = await _context.Districts.ToListAsync();
            var hospitals = await _context.Hospitals.ToListAsync();
            var bloodTypes = await _context.BloodTypes.ToListAsync();
            var stocks = await _context.BloodStocks.ToListAsync();

            var result = new Dictionary<string, Dictionary<string, int>>();

            foreach (var district in districts)
            {
                var hospital = hospitals.FirstOrDefault(h => h.DistrictId == district.Id);
                var districtStocks = new Dictionary<string, int>();

                foreach (var bt in bloodTypes)
                {
                    int units = 0;
                    if (hospital != null)
                    {
                        var stock = stocks.FirstOrDefault(s => s.HospitalId == hospital.Id && s.BloodTypeId == bt.Id);
                        if (stock != null)
                        {
                            units = stock.Units;
                        }
                    }
                    districtStocks[bt.Name] = units;
                }
                result[district.Name] = districtStocks;
            }

            return Ok(result);
        }

        [HttpGet("stock-transfers")]
        public async Task<ActionResult<IEnumerable<object>>> GetStockTransfers()
        {
            var transfers = await _context.StockTransfers
                .OrderByDescending(t => t.TransferDate)
                .Select(t => new
                {
                    t.Id,
                    t.SenderDistrict,
                    t.ReceiverDistrict,
                    kg = t.BloodType,
                    amount = t.Amount,
                    t.Distance,
                    date = t.TransferDate.ToString("dd.MM.yyyy"),
                    time = t.TransferDate.ToString("HH:mm")
                })
                .ToListAsync();
            return Ok(transfers);
        }

        public class StockUpdateDto
        {
            public string District { get; set; } = string.Empty;
            public string BloodType { get; set; } = string.Empty;
            public int Units { get; set; }
        }

        [HttpPost("stocks/update")]
        public async Task<IActionResult> UpdateSingleStock([FromBody] StockUpdateDto dto)
        {
            if (dto == null) return BadRequest("Geçersiz veri.");

            var district = await _context.Districts.FirstOrDefaultAsync(d => d.Name == dto.District);
            if (district == null) return BadRequest("İlçe bulunamadı.");

            var hospital = await _context.Hospitals.FirstOrDefaultAsync(h => h.DistrictId == district.Id);
            if (hospital == null) return BadRequest("Hastane bulunamadı.");

            var bt = await _context.BloodTypes.FirstOrDefaultAsync(b => b.Name == dto.BloodType);
            if (bt == null) return BadRequest("Kan grubu bulunamadı.");

            var stock = await _context.BloodStocks.FirstOrDefaultAsync(s => s.HospitalId == hospital.Id && s.BloodTypeId == bt.Id);
            if (stock == null)
            {
                stock = new BloodStock { HospitalId = hospital.Id, BloodTypeId = bt.Id, Units = dto.Units, LastUpdated = DateTime.UtcNow };
                _context.BloodStocks.Add(stock);
            }
            else
            {
                stock.Units = dto.Units;
                stock.LastUpdated = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        public class StockTransferDto
        {
            public string Sender { get; set; } = string.Empty;
            public string Receiver { get; set; } = string.Empty;
            public string Kg { get; set; } = string.Empty;
            public int Amount { get; set; }
            public double Distance { get; set; }
        }

        [HttpPost("stock-transfers")]
        public async Task<IActionResult> CreateStockTransfer([FromBody] StockTransferDto dto)
        {
            if (dto == null) return BadRequest("Geçersiz veri.");

            // Bölgeleri ve hastaneleri bulun
            var senderDist = await _context.Districts.FirstOrDefaultAsync(d => d.Name == dto.Sender);
            var receiverDist = await _context.Districts.FirstOrDefaultAsync(d => d.Name == dto.Receiver);
            if (senderDist == null || receiverDist == null) return BadRequest("Geçersiz ilçe.");

            var senderHosp = await _context.Hospitals.FirstOrDefaultAsync(h => h.DistrictId == senderDist.Id);
            var receiverHosp = await _context.Hospitals.FirstOrDefaultAsync(h => h.DistrictId == receiverDist.Id);
            if (senderHosp == null || receiverHosp == null) return BadRequest("Hastaneler bulunamadı.");

            var bt = await _context.BloodTypes.FirstOrDefaultAsync(b => b.Name == dto.Kg);
            if (bt == null) return BadRequest("Geçersiz kan grubu.");

            var senderStock = await _context.BloodStocks.FirstOrDefaultAsync(s => s.HospitalId == senderHosp.Id && s.BloodTypeId == bt.Id);
            if (senderStock == null) return BadRequest("Gönderen stok bulunamadı.");

            if (senderStock.Units < dto.Amount) return BadRequest("Yetersiz stok.");

            var receiverStock = await _context.BloodStocks.FirstOrDefaultAsync(s => s.HospitalId == receiverHosp.Id && s.BloodTypeId == bt.Id);
            if (receiverStock == null)
            {
                receiverStock = new BloodStock { HospitalId = receiverHosp.Id, BloodTypeId = bt.Id, Units = 0, LastUpdated = DateTime.UtcNow };
                _context.BloodStocks.Add(receiverStock);
            }

            // Çıkar ve Ekle
            senderStock.Units -= dto.Amount;
            senderStock.LastUpdated = DateTime.UtcNow;
            receiverStock.Units += dto.Amount;
            receiverStock.LastUpdated = DateTime.UtcNow;

            // Aktarım kaydı oluştur
            var transfer = new StockTransfer
            {
                SenderDistrict = dto.Sender,
                ReceiverDistrict = dto.Receiver,
                BloodType = dto.Kg,
                Amount = dto.Amount,
                Distance = dto.Distance,
                TransferDate = DateTime.UtcNow
            };
            _context.StockTransfers.Add(transfer);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Transfer başarıyla tamamlandı." });
        }
    }
}
