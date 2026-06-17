using KanYonetim.API.Models;
using KanYonetim.API.Models.DTOs;

namespace KanYonetim.API.Services
{
    public interface IDonationEligibilityService
    {
        EligibilityDto GetEligibility(User user);
    }

    public class DonationEligibilityService : IDonationEligibilityService
    {
        public EligibilityDto GetEligibility(User user)
        {
            if (user == null) return new EligibilityDto { IsEligible = false, Message = "Kullanıcı bulunamadı." };

            if (user.LastDonationDate == null)
            {
                return new EligibilityDto
                {
                    IsEligible = true,
                    Message = "Daha önce bağış yapmadınız. Bağış yapmaya uygunsunuz."
                };
            }

            int requiredDays = user.Gender == "Kadın" ? 120 : 90;
            DateTime nextEligibleDate = user.LastDonationDate.Value.AddDays(requiredDays);
            DateTime today = DateTime.UtcNow.Date;

            if (today >= nextEligibleDate.Date)
            {
                return new EligibilityDto
                {
                    IsEligible = true,
                    NextEligibleDate = nextEligibleDate,
                    Message = "Bağış yapmaya uygunsunuz."
                };
            }
            else
            {
                int daysRemaining = (nextEligibleDate.Date - today).Days;
                return new EligibilityDto
                {
                    IsEligible = false,
                    NextEligibleDate = nextEligibleDate,
                    DaysRemaining = daysRemaining,
                    Message = $"Bağış yapmak için {daysRemaining} gün daha beklemeniz gerekmektedir. Bir sonraki uygun tarih: {nextEligibleDate:dd.MM.yyyy}."
                };
            }
        }
    }
}
