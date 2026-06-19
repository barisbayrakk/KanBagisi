using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using KanYonetim.API.Data;
using KanYonetim.API.Models;

namespace KanYonetim.API.Services
{
    public class DonationReminderBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<DonationReminderBackgroundService> _logger;
        // Kontroller arasındaki aralık (örn. geliştirme/gösterim için her 1 dakikada bir kontrol)
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1);

        public DonationReminderBackgroundService(
            IServiceScopeFactory scopeFactory,
            ILogger<DonationReminderBackgroundService> _logger)
        {
            _scopeFactory = scopeFactory;
            this._logger = _logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Donation Eligibility Reminder Service starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Checking user eligibility for donation reminders...");
                    await CheckEligibilityAndNotifyAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while executing donation eligibility checks.");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }

            _logger.LogInformation("Donation Eligibility Reminder Service stopping.");
        }

        private async Task CheckEligibilityAndNotifyAsync(CancellationToken stoppingToken)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                // Daha önce bağışta bulunan tüm bağışçıları alın
                var donors = await dbContext.Users
                    .Where(u => u.Role == "Donor" && u.LastDonationDate != null)
                    .ToListAsync(stoppingToken);

                DateTime today = DateTime.UtcNow.Date;

                foreach (var user in donors)
                {
                    if (stoppingToken.IsCancellationRequested) break;

                    // Kadın: 120 gün, Erkek/Diğer: 90 gün
                    int requiredDays = user.Gender == "Kadın" ? 120 : 90;
                    DateTime lastDonation = user.LastDonationDate!.Value;
                    DateTime nextEligibleDate = lastDonation.AddDays(requiredDays);

                    // Kullanıcı uygunsa
                    if (today >= nextEligibleDate.Date)
                    {
                        // Son bağış tarihinden sonra hatırlatma bildiriminin gönderilip gönderilmediğini kontrol edin
                        bool alreadyNotified = await dbContext.Notifications
                            .AnyAsync(n => n.UserId == user.Id && 
                                           n.Type == "DonationEligibilityReminder" && 
                                           n.CreatedAt >= lastDonation, 
                                      stoppingToken);

                        if (!alreadyNotified)
                        {
                            _logger.LogInformation("User {UserId} ({Email}) is eligible to donate again. Creating notification...", user.Id, user.Email);

                            // Veritabanı Bildirimi Oluştur
                            var notification = new Notification
                            {
                                UserId = user.Id,
                                Title = "Yeniden hayat kurtarmaya hazırsınız!",
                                Message = "Son kan bağışınızın üzerinden biyolojik olarak gereken süre geçmiştir. Yeni bir bağış yaparak yeniden hayat kurtarmaya hazırsınız!",
                                Type = "DonationEligibilityReminder",
                                IsRead = false,
                                CreatedAt = DateTime.UtcNow
                            };
                            dbContext.Notifications.Add(notification);

                            // Profil etkinliğini günlüğe kaydet
                            var log = new ProfileActivityLog
                            {
                                UserId = user.Id,
                                ActionType = "DonationEligibilityReminder",
                                Description = "Yeniden bağış yapılabilir hatırlatması oluşturuldu.",
                                CreatedAt = DateTime.UtcNow
                            };
                            dbContext.ProfileActivityLogs.Add(log);

                            // E-posta Bildirimi Gönder
                            if (user.EmailNotifications && !string.IsNullOrEmpty(user.Email))
                            {
                                try
                                {
                                    string subject = "Yeniden Hayat Kurtarmaya Hazırsınız! 🩸";
                                    string htmlMessage = $@"
                                        <div style='font-family: Arial, sans-serif; padding: 20px; color: #333333;'>
                                            <h2 style='color: #991b1b;'>Merhaba {user.FullName},</h2>
                                            <p>Biyolojik olarak yeniden kan bağışı yapabilmeniz için geçmesi gereken süre dolmuştur.</p>
                                            <p style='font-size: 1.1em; font-weight: bold; color: #059669;'>Yeniden hayat kurtarmaya hazırsınız!</p>
                                            <p>En yakın kan bağış noktasına giderek veya platform üzerinden acil kan taleplerine başvurarak hayat kurtarmaya katkıda bulunabilirsiniz.</p>
                                            <hr style='border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;' />
                                            <p style='font-size: 0.85em; color: #777777;'>Bu e-posta Hayat Ağı Kan Yönetim Platformu tarafından otomatik olarak gönderilmiştir.</p>
                                        </div>";

                                    await emailService.SendEmailAsync(user.Email, subject, htmlMessage);
                                    _logger.LogInformation("Sent donation eligibility email to {Email}", user.Email);
                                }
                                catch (Exception emailEx)
                                {
                                    _logger.LogError(emailEx, "Failed to send donation reminder email to user {UserId} ({Email})", user.Id, user.Email);
                                }
                            }
                        }
                    }
                }

                await dbContext.SaveChangesAsync(stoppingToken);
            }
        }
    }
}
