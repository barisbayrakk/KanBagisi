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
            // Seed Admin if not exists
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

            // Seed Donors if less than 10 users exist
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
                    
                    // Generate clean email without special Turkish characters
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

                // Seed Donation Requests and Applications
                var hospitals = context.Hospitals.ToList();
                if (hospitals.Any())
                {
                    var seededRequests = new List<DonationRequest>();
                    var urgencies = new[] { "Normal", "Acil", "Kritik" };
                    var statuses = new[] { "Active", "Fulfilled" };

                    // Seed 25 donation requests
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

                    // Seed Donation Applications for the users
                    var donationRequests = context.DonationRequests.ToList();
                    var appStatuses = new[] { "Pending", "Approved", "Rejected" };
                    var seededApps = new List<DonationApplication>();

                    foreach (var request in donationRequests)
                    {
                        // Match 1-3 users to apply to this request
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

                            // Create an audit log for approved or pending donations
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

            // Seed Support Tickets
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
