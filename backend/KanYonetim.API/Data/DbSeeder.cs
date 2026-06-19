using System;
using System.Collections.Generic;
using System.Linq;
using KanYonetim.API.Models;
using BCrypt.Net;

namespace KanYonetim.API.Data
{
    public static class DbSeeder
    {
        public static void SeedData(AppDbContext context)
        {
            // Tohum Yöneticisi mevcut değilse
            if (!context.Users.Any(u => u.Role == "Admin"))
            {
                var adminUser = new User
                {
                    FullName = "Sistem Yöneticisi",
                    Email = "admin@kanyonetim.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sifre123!"),
                    Tc = "10000000000",
                    Phone = "05000000000",
                    Gender = "Erkek",
                    BloodTypeId = 1,
                    DistrictId = 20, // Fatih
                    Role = "Admin",
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                };
                context.Users.Add(adminUser);
                context.SaveChanges();
            }

            // Mevcut değilse Çekirdek Alt Yöneticileri
            if (!context.Users.Any(u => u.Role == "SubAdmin"))
            {
                var subAdmins = new List<User>
                {
                    new User { FullName = "Yardımcı Admin 1", Email = "yradmin@hotmail.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sifre123!"), Tc = "10000000001", Phone = "05000000001", Gender = "Erkek", BloodTypeId = 1, DistrictId = 20, Role = "SubAdmin", IsEmailVerified = true, CreatedAt = DateTime.UtcNow },
                    new User { FullName = "Yardımcı Admin 2", Email = "yradmin2@hotmail.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sifre123!"), Tc = "10000000002", Phone = "05000000002", Gender = "Kadın", BloodTypeId = 2, DistrictId = 20, Role = "SubAdmin", IsEmailVerified = true, CreatedAt = DateTime.UtcNow },
                    new User { FullName = "Yardımcı Admin 3", Email = "yradmin3@hotmail.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sifre123!"), Tc = "10000000003", Phone = "05000000003", Gender = "Erkek", BloodTypeId = 3, DistrictId = 20, Role = "SubAdmin", IsEmailVerified = true, CreatedAt = DateTime.UtcNow },
                    new User { FullName = "Yardımcı Admin 4", Email = "yradmin4@hotmail.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sifre123!"), Tc = "10000000004", Phone = "05000000004", Gender = "Kadın", BloodTypeId = 4, DistrictId = 20, Role = "SubAdmin", IsEmailVerified = true, CreatedAt = DateTime.UtcNow },
                    new User { FullName = "Yardımcı Admin 5", Email = "yradmin5@hotmail.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sifre123!"), Tc = "10000000005", Phone = "05000000005", Gender = "Erkek", BloodTypeId = 5, DistrictId = 20, Role = "SubAdmin", IsEmailVerified = true, CreatedAt = DateTime.UtcNow }
                };
                context.Users.AddRange(subAdmins);
                context.SaveChanges();
            }

            // 10'dan az kullanıcı varsa Tohum Bağışçıları
            if (context.Users.Count(u => u.Role == "Donor") < 10)
            {
                var random = new Random(42); // deterministic random seed
                var firstNames = new[] { "Ahmet", "Mehmet", "Mustafa", "Yusuf", "Ali", "Ayşe", "Fatma", "Emine", "Hatice", "Zeynep", "Elif", "Ömer", "Halil", "İbrahim", "Hüseyin", "Hasan", "Murat", "Hakan", "Gökhan", "Serkan", "Yavuz", "Sinan", "Burak", "Can", "Kerem", "Cem", "Deniz", "Ege", "Emre", "Seda", "Merve", "Büşra", "Tuğçe", "Gizem", "Hilal", "Kübra", "Selin", "Yasemin", "Ebru", "Pelin", "Gamze", "Aslı", "Başak", "Ceyda", "Didem", "Ezgi", "İrem", "Melis", "Banu", "Cemre" };
                var lastNames = new[] { "Yılmaz", "Kaya", "Demir", "Şahin", "Çelik", "Yıldız", "Yıldırım", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara", "Köse", "Polat", "Özkan", "Erdem", "Aksoy", "Bulut", "Tekin", "Yalçın", "Avcı", "Ateş", "Koç", "Şen", "Sarı", "Kahraman", "Çakır", "Öz", "Güler", "Yaman", "Şimşek", "Güneş", "Kartal", "Kaplan", "Koca", "Karaca", "Coşkun", "Keskin", "Uysal", "Turan", "Aktaş", "Karataş", "Kılıçarslan", "Bozkurt", "Yavuz", "Uzun" };
                var emailDomains = new[] { "gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "yandex.com" };
                var genders = new[] { "Erkek", "Kadın" };

                var seededUsers = new List<User>();

                for (int i = 0; i < 50; i++)
                {
                    string firstName = firstNames[i % firstNames.Length];
                    string lastName = lastNames[i % lastNames.Length];
                    string fullName = $"{firstName} {lastName}";
                    
                    // Özel Türkçe karakterler olmadan temiz e-posta oluşturun
                    string cleanFirstName = ReplaceTurkishChars(firstName.ToLower());
                    string cleanLastName = ReplaceTurkishChars(lastName.ToLower());
                    string email = $"{cleanFirstName}.{cleanLastName}{i + 1}@{emailDomains[i % emailDomains.Length]}";
                    
                    string tc = (10000000000L + random.Next(10000000, 99999999) * 100 + i).ToString();
                    string phone = $"05{random.Next(30, 56)}{random.Next(100, 999)}{random.Next(10, 99)}{random.Next(10, 99)}";
                    string gender = genders[random.Next(genders.Length)];
                    int bloodTypeId = random.Next(1, 9); // 1-8
                    int districtId = random.Next(1, 40); // 1-39

                    var user = new User
                    {
                        FullName = fullName,
                        Email = email,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sifre123!"),
                        Tc = tc,
                        Phone = phone,
                        Gender = gender,
                        BloodTypeId = bloodTypeId,
                        DistrictId = districtId,
                        Role = "Donor",
                        IsEmailVerified = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-random.Next(5, 30)),
                        LastDonationDate = random.Next(2) == 0 ? DateTime.UtcNow.AddDays(-random.Next(40, 150)) : null
                    };

                    seededUsers.Add(user);
                }

                context.Users.AddRange(seededUsers);
                context.SaveChanges();

                // Tohum Bağış Talepleri ve Başvuruları
                var hospitals = context.Hospitals.ToList();
                if (hospitals.Any())
                {
                    var seededRequests = new List<DonationRequest>();
                    var urgencies = new[] { "Normal", "Acil", "Kritik" };
                    var statuses = new[] { "Active", "Fulfilled" };

                    // 25 bağış talebini tohumlayın
                    for (int i = 0; i < 25; i++)
                    {
                        var request = new DonationRequest
                        {
                            HospitalId = hospitals[random.Next(hospitals.Count)].Id,
                            BloodTypeId = random.Next(1, 9),
                            UnitsNeeded = random.Next(2, 10),
                            UrgencyLevel = urgencies[random.Next(urgencies.Length)],
                            Status = statuses[random.Next(statuses.Length)],
                            ProtocolNumber = $"PRT-{random.Next(10000, 99999)}",
                            CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 15))
                        };
                        seededRequests.Add(request);
                    }
                    context.DonationRequests.AddRange(seededRequests);
                    context.SaveChanges();

                    // Kullanıcılara yönelik Tohum Bağış Uygulamaları
                    var donationRequests = context.DonationRequests.ToList();
                    var appStatuses = new[] { "Pending", "Approved", "Rejected" };
                    var seededApps = new List<DonationApplication>();

                    foreach (var request in donationRequests)
                    {
                        // Bu isteğe başvurmak için 1-3 kullanıcıyı eşleştirin
                        int appCount = random.Next(1, 4);
                        var eligibleDonors = seededUsers
                            .Where(u => u.BloodTypeId == request.BloodTypeId)
                            .OrderBy(x => Guid.NewGuid())
                            .Take(appCount)
                            .ToList();

                        foreach (var donor in eligibleDonors)
                        {
                            var appStatus = appStatuses[random.Next(appStatuses.Length)];
                            if (request.Status == "Fulfilled")
                            {
                                appStatus = "Approved"; // Completed requests should have approved applications
                            }

                            var app = new DonationApplication
                            {
                                DonorId = donor.Id,
                                DonationRequestId = request.Id,
                                Status = appStatus,
                                VerificationCode = appStatus == "Pending" ? $"DONOR-{random.Next(1000, 9999)}" : null,
                                IsApproved = appStatus == "Approved",
                                ApplicationDate = request.CreatedAt.AddHours(random.Next(2, 48))
                            };
                            seededApps.Add(app);

                            // Onaylanmış veya bekleyen bağışlar için bir denetim günlüğü oluşturun
                            context.AuditLogs.Add(new AuditLog
                            {
                                UserId = donor.Id,
                                ActionType = "DonationApplication",
                                EntityName = "DonationApplication",
                                EntityId = app.Id.ToString(),
                                IpAddress = $"192.168.1.{random.Next(10, 200)}",
                                Description = $"{donor.FullName} isimli bağışçı {request.Id} nolu talebe başvurdu. Durum: {appStatus}",
                                CreatedAt = app.ApplicationDate
                            });
                        }
                    }
                    context.DonationApplications.AddRange(seededApps);
                    context.SaveChanges();
                }
            }

            // Tohum Destek Biletleri
            if (context.SupportTickets.Count() < 5)
            {
                var donors = context.Users.Where(u => u.Role == "Donor").ToList();
                var admin = context.Users.FirstOrDefault(u => u.Role == "Admin");
                
                if (donors.Any() && admin != null)
                {
                    var random = new Random(99);
                    var ticketTemplates = new List<(string Subject, string Status, List<(string Text, bool IsAdmin)> Messages)>
                    {
                        (
                            "Bağış Randevumu Nasıl İptal Ederim?",
                            "Resolved",
                            new List<(string Text, bool IsAdmin)>
                            {
                                ("Merhaba, yarın Fatih bölgesinde bağış yapacaktım ama işim çıktı. Randevumu nasıl iptal edebilirim?", false),
                                ("Merhaba Ahmet Bey, randevunuzu profil sayfanızdaki 'Aktif Randevularım' kısmından veya bu panel üzerinden iptal edebilirsiniz. Sağlıklı günler dileriz.", true),
                                ("Teşekkürler, iptal ettim.", false)
                            }
                        ),
                        (
                            "Mobil Bağış Noktaları Nerelerde?",
                            "Answered",
                            new List<(string Text, bool IsAdmin)>
                            {
                                ("Kadıköy bölgesindeki mobil Kızılay tırlarının bu haftaki programını öğrenebilir miyim?", false),
                                ("Merhaba, bu hafta Kadıköy İskele Meydanı'nda 10:00 - 19:00 saatleri arasında iki adet bağış tırımız hizmet vermektedir.", true)
                            }
                        ),
                        (
                            "Kan Bağışı Sonrası Halsizlik",
                            "Resolved",
                            new List<(string Text, bool IsAdmin)>
                            {
                                ("Dün akşam kan bağışı yaptım, bugün hafif bir baş dönmesi ve halsizlik var. Normal midir?", false),
                                ("Merhaba Zeynep Hanım, bağış sonrası ilk 24-48 saat hafif halsizlik normaldir. Lütfen bol sıvı tükettiğinizden emin olun ve aşırı fiziksel aktiviteden kaçının. Şikayetleriniz artarsa en yakın sağlık kuruluşuna başvurmanızı öneririz.", true),
                                ("Tamamdır, dinleniyorum. Çok teşekkürler.", false)
                            }
                        ),
                        (
                            "Sistem Giriş Problemi",
                            "Open",
                            new List<(string Text, bool IsAdmin)>
                            {
                                ("Google ile giriş yapmaya çalışırken hata alıyorum. Giriş sayfası sürekli yenileniyor.", false)
                            }
                        ),
                        (
                            "Kan Grubu Değişikliği Hakkında",
                            "Answered",
                            new List<(string Text, bool IsAdmin)>
                            {
                                ("Profilimdeki kan grubunu yanlış seçmişim, değiştirmek istiyorum ama alan kilitli görünüyor.", false),
                                ("Merhaba, kan grubu güvenliğiniz için kilitli bir alandır. Doğru kan grubunuzu gösteren bir belge veya rapor ile en yakın merkezimize başvurursanız güncellemeyi sizin için yapabiliriz.", true)
                            }
                        ),
                        (
                            "Plazma Bağışı Yapabilir miyim?",
                            "Resolved",
                            new List<(string Text, bool IsAdmin)>
                            {
                                ("Merhabalar, normal kan bağışı dışında plazma bağışı da kabul ediyor musunuz?", false),
                                ("Merhaba, plazma bağışları sadece belirli merkezlerimizde (örneğin Çapa ve Haydarpaşa) yapılabilmektedir. Önceden randevu almanız gerekmektedir.", true)
                            }
                        ),
                        (
                            "Yaş Sınırı Nedir?",
                            "Closed",
                            new List<(string Text, bool IsAdmin)>
                            {
                                ("17 yaşındayım, veli izin belgesiyle kan bağışı yapabilir miyim?", false),
                                ("Merhaba, yasal mevzuat gereği kan bağışı için alt yaş sınırı 18'dir. Veli izni olsa dahi 18 yaş altı kişilerden bağış kabul edilememektedir.", true)
                            }
                        )
                    };

                    foreach (var template in ticketTemplates)
                    {
                        var donor = donors[random.Next(donors.Count)];
                        var ticket = new SupportTicket
                        {
                            UserId = donor.Id,
                            Subject = template.Subject,
                            Status = template.Status,
                            CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 10)),
                            UpdatedAt = DateTime.UtcNow
                        };
                        context.SupportTickets.Add(ticket);
                        context.SaveChanges();

                        var messageTime = ticket.CreatedAt;
                        foreach (var msgTemplate in template.Messages)
                        {
                            messageTime = messageTime.AddHours(random.Next(1, 5));
                            var msg = new SupportMessage
                            {
                                SupportTicketId = ticket.Id,
                                SenderId = msgTemplate.IsAdmin ? admin.Id : donor.Id,
                                MessageText = msgTemplate.Text,
                                CreatedAt = messageTime
                            };
                            context.SupportMessages.Add(msg);
                        }
                        context.SaveChanges();
                    }
                }
            }
            // Tüm bölgeler için eksik hastanelerin tohumlarını atın ve BloodStock'u doldurun
            var allDistricts = context.Districts.ToList();
            var bloodTypes = context.BloodTypes.ToList();
            if (context.BloodStocks.Count() == 0 && allDistricts.Any() && bloodTypes.Any())
            {
                // Her bölgede en az bir hastanenin olmasını sağlayın
                var existingHospitals = context.Hospitals.ToList();
                foreach (var dist in allDistricts)
                {
                    if (!existingHospitals.Any(h => h.DistrictId == dist.Id))
                    {
                        var newHospital = new Hospital 
                        { 
                            Name = $"{dist.Name} İlçe Devlet Hastanesi", 
                            DistrictId = dist.Id, 
                            Address = dist.Name, 
                            Phone = "0212 000 00 00" 
                        };
                        context.Hospitals.Add(newHospital);
                        existingHospitals.Add(newHospital);
                    }
                }
                context.SaveChanges();

                // Tohum Veri Haritası
                var seedData = new Dictionary<string, Dictionary<string, int>>
                {
                    { "Adalar", new Dictionary<string, int> { { "0+", 2 }, { "0-", 1 }, { "A+", 3 }, { "A-", 0 }, { "B+", 1 }, { "B-", 0 }, { "AB+", 1 }, { "AB-", 0 } } },
                    { "Arnavutköy", new Dictionary<string, int> { { "0+", 4 }, { "0-", 2 }, { "A+", 3 }, { "A-", 1 }, { "B+", 5 }, { "B-", 0 }, { "AB+", 2 }, { "AB-", 0 } } },
                    { "Ataşehir", new Dictionary<string, int> { { "0+", 15 }, { "0-", 6 }, { "A+", 22 }, { "A-", 5 }, { "B+", 12 }, { "B-", 3 }, { "AB+", 8 }, { "AB-", 2 } } },
                    { "Avcılar", new Dictionary<string, int> { { "0+", 8 }, { "0-", 3 }, { "A+", 12 }, { "A-", 2 }, { "B+", 7 }, { "B-", 1 }, { "AB+", 4 }, { "AB-", 0 } } },
                    { "Bağcılar", new Dictionary<string, int> { { "0+", 25 }, { "0-", 10 }, { "A+", 32 }, { "A-", 8 }, { "B+", 18 }, { "B-", 4 }, { "AB+", 11 }, { "AB-", 3 } } },
                    { "Bahçelievler", new Dictionary<string, int> { { "0+", 18 }, { "0-", 7 }, { "A+", 24 }, { "A-", 6 }, { "B+", 14 }, { "B-", 3 }, { "AB+", 9 }, { "AB-", 2 } } },
                    { "Bakırköy", new Dictionary<string, int> { { "0+", 30 }, { "0-", 12 }, { "A+", 40 }, { "A-", 10 }, { "B+", 25 }, { "B-", 5 }, { "AB+", 15 }, { "AB-", 4 } } },
                    { "Başakşehir", new Dictionary<string, int> { { "0+", 12 }, { "0-", 4 }, { "A+", 18 }, { "A-", 3 }, { "B+", 10 }, { "B-", 2 }, { "AB+", 6 }, { "AB-", 1 } } },
                    { "Bayrampaşa", new Dictionary<string, int> { { "0+", 9 }, { "0-", 2 }, { "A+", 14 }, { "A-", 3 }, { "B+", 8 }, { "B-", 1 }, { "AB+", 5 }, { "AB-", 0 } } },
                    { "Beşiktaş", new Dictionary<string, int> { { "0+", 45 }, { "0-", 18 }, { "A+", 52 }, { "A-", 15 }, { "B+", 35 }, { "B-", 8 }, { "AB+", 22 }, { "AB-", 6 } } },
                    { "Beykoz", new Dictionary<string, int> { { "0+", 5 }, { "0-", 2 }, { "A+", 8 }, { "A-", 1 }, { "B+", 4 }, { "B-", 0 }, { "AB+", 2 }, { "AB-", 0 } } },
                    { "Beylikdüzü", new Dictionary<string, int> { { "0+", 14 }, { "0-", 5 }, { "A+", 19 }, { "A-", 4 }, { "B+", 11 }, { "B-", 2 }, { "AB+", 7 }, { "AB-", 1 } } },
                    { "Beyoğlu", new Dictionary<string, int> { { "0+", 22 }, { "0-", 8 }, { "A+", 28 }, { "A-", 7 }, { "B+", 16 }, { "B-", 4 }, { "AB+", 10 }, { "AB-", 3 } } },
                    { "Büyükçekmece", new Dictionary<string, int> { { "0+", 6 }, { "0-", 2 }, { "A+", 9 }, { "A-", 1 }, { "B+", 5 }, { "B-", 0 }, { "AB+", 3 }, { "AB-", 0 } } },
                    { "Çatalca", new Dictionary<string, int> { { "0+", 2 }, { "0-", 0 }, { "A+", 4 }, { "A-", 0 }, { "B+", 2 }, { "B-", 0 }, { "AB+", 1 }, { "AB-", 0 } } },
                    { "Çekmeköy", new Dictionary<string, int> { { "0+", 7 }, { "0-", 2 }, { "A+", 11 }, { "A-", 2 }, { "B+", 6 }, { "B-", 1 }, { "AB+", 3 }, { "AB-", 0 } } },
                    { "Esenler", new Dictionary<string, int> { { "0+", 13 }, { "0-", 4 }, { "A+", 17 }, { "A-", 3 }, { "B+", 9 }, { "B-", 2 }, { "AB+", 5 }, { "AB-", 1 } } },
                    { "Esenyurt", new Dictionary<string, int> { { "0+", 20 }, { "0-", 8 }, { "A+", 26 }, { "A-", 6 }, { "B+", 15 }, { "B-", 3 }, { "AB+", 9 }, { "AB-", 2 } } },
                    { "Eyüpsultan", new Dictionary<string, int> { { "0+", 11 }, { "0-", 3 }, { "A+", 16 }, { "A-", 4 }, { "B+", 9 }, { "B-", 2 }, { "AB+", 6 }, { "AB-", 1 } } },
                    { "Fatih", new Dictionary<string, int> { { "0+", 40 }, { "0-", 15 }, { "A+", 48 }, { "A-", 12 }, { "B+", 30 }, { "B-", 7 }, { "AB+", 18 }, { "AB-", 5 } } },
                    { "Gaziosmanpaşa", new Dictionary<string, int> { { "0+", 10 }, { "0-", 3 }, { "A+", 15 }, { "A-", 3 }, { "B+", 8 }, { "B-", 2 }, { "AB+", 5 }, { "AB-", 1 } } },
                    { "Güngören", new Dictionary<string, int> { { "0+", 8 }, { "0-", 2 }, { "A+", 13 }, { "A-", 2 }, { "B+", 7 }, { "B-", 1 }, { "AB+", 4 }, { "AB-", 0 } } },
                    { "Kadıköy", new Dictionary<string, int> { { "0+", 50 }, { "0-", 20 }, { "A+", 60 }, { "A-", 18 }, { "B+", 40 }, { "B-", 10 }, { "AB+", 25 }, { "AB-", 8 } } },
                    { "Kağıthane", new Dictionary<string, int> { { "0+", 12 }, { "0-", 4 }, { "A+", 17 }, { "A-", 4 }, { "B+", 10 }, { "B-", 2 }, { "AB+", 6 }, { "AB-", 1 } } },
                    { "Kartal", new Dictionary<string, int> { { "0+", 28 }, { "0-", 11 }, { "A+", 35 }, { "A-", 9 }, { "B+", 22 }, { "B-", 5 }, { "AB+", 13 }, { "AB-", 4 } } },
                    { "Küçükçekmece", new Dictionary<string, int> { { "0+", 16 }, { "0-", 6 }, { "A+", 22 }, { "A-", 5 }, { "B+", 13 }, { "B-", 3 }, { "AB+", 8 }, { "AB-", 2 } } },
                    { "Maltepe", new Dictionary<string, int> { { "0+", 24 }, { "0-", 9 }, { "A+", 30 }, { "A-", 8 }, { "B+", 19 }, { "B-", 4 }, { "AB+", 11 }, { "AB-", 3 } } },
                    { "Pendik", new Dictionary<string, int> { { "0+", 32 }, { "0-", 13 }, { "A+", 42 }, { "A-", 11 }, { "B+", 26 }, { "B-", 6 }, { "AB+", 16 }, { "AB-", 4 } } },
                    { "Sancaktepe", new Dictionary<string, int> { { "0+", 9 }, { "0-", 3 }, { "A+", 13 }, { "A-", 2 }, { "B+", 8 }, { "B-", 1 }, { "AB+", 5 }, { "AB-", 0 } } },
                    { "Sarıyer", new Dictionary<string, int> { { "0+", 18 }, { "0-", 7 }, { "A+", 23 }, { "A-", 6 }, { "B+", 14 }, { "B-", 3 }, { "AB+", 9 }, { "AB-", 2 } } },
                    { "Silivri", new Dictionary<string, int> { { "0+", 4 }, { "0-", 1 }, { "A+", 6 }, { "A-", 1 }, { "B+", 3 }, { "B-", 0 }, { "AB+", 2 }, { "AB-", 0 } } },
                    { "Sultanbeyli", new Dictionary<string, int> { { "0+", 8 }, { "0-", 2 }, { "A+", 11 }, { "A-", 2 }, { "B+", 6 }, { "B-", 1 }, { "AB+", 4 }, { "AB-", 0 } } },
                    { "Sultangazi", new Dictionary<string, int> { { "0+", 11 }, { "0-", 4 }, { "A+", 15 }, { "A-", 3 }, { "B+", 9 }, { "B-", 2 }, { "AB+", 5 }, { "AB-", 1 } } },
                    { "Şile", new Dictionary<string, int> { { "0+", 1 }, { "0-", 0 }, { "A+", 2 }, { "A-", 0 }, { "B+", 1 }, { "B-", 0 }, { "AB+", 0 }, { "AB-", 0 } } },
                    { "Şişli", new Dictionary<string, int> { { "0+", 42 }, { "0-", 16 }, { "A+", 50 }, { "A-", 14 }, { "B+", 32 }, { "B-", 8 }, { "AB+", 20 }, { "AB-", 5 } } },
                    { "Tuzla", new Dictionary<string, int> { { "0+", 12 }, { "0-", 4 }, { "A+", 16 }, { "A-", 4 }, { "B+", 10 }, { "B-", 2 }, { "AB+", 6 }, { "AB-", 1 } } },
                    { "Ümraniye", new Dictionary<string, int> { { "0+", 30 }, { "0-", 12 }, { "A+", 38 }, { "A-", 10 }, { "B+", 24 }, { "B-", 5 }, { "AB+", 15 }, { "AB-", 4 } } },
                    { "Üsküdar", new Dictionary<string, int> { { "0+", 38 }, { "0-", 15 }, { "A+", 46 }, { "A-", 12 }, { "B+", 29 }, { "B-", 7 }, { "AB+", 17 }, { "AB-", 4 } } },
                    { "Zeytinburnu", new Dictionary<string, int> { { "0+", 14 }, { "0-", 5 }, { "A+", 19 }, { "A-", 4 }, { "B+", 11 }, { "B-", 2 }, { "AB+", 7 }, { "AB-", 1 } } }
                };

                foreach (var distName in seedData.Keys)
                {
                    var district = allDistricts.FirstOrDefault(d => d.Name == distName);
                    if (district != null)
                    {
                        var hosp = existingHospitals.FirstOrDefault(h => h.DistrictId == district.Id);
                        if (hosp != null)
                        {
                            foreach (var btData in seedData[distName])
                            {
                                var bType = bloodTypes.FirstOrDefault(b => b.Name == btData.Key);
                                if (bType != null)
                                {
                                    context.BloodStocks.Add(new BloodStock
                                    {
                                        HospitalId = hosp.Id,
                                        BloodTypeId = bType.Id,
                                        Units = btData.Value,
                                        LastUpdated = DateTime.UtcNow
                                    });
                                }
                            }
                        }
                    }
                }
                context.SaveChanges();
            }
        }

        private static string ReplaceTurkishChars(string input)
        {
            var mapping = new Dictionary<char, char>
            {
                { 'ç', 'c' }, { 'ğ', 'g' }, { 'ı', 'i' }, { 'ö', 'o' }, { 'ş', 's' }, { 'ü', 'u' },
                { 'Ç', 'C' }, { 'Ğ', 'G' }, { 'İ', 'I' }, { 'Ö', 'O' }, { 'Ş', 'S' }, { 'Ü', 'U' }
            };

            foreach (var pair in mapping)
            {
                input = input.Replace(pair.Key, pair.Value);
            }

            return input;
        }
    }
}
