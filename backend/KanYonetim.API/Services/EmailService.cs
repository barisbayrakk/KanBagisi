using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace KanYonetim.API.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var host = _config["EmailSettings:Host"] ?? "sandbox.smtp.mailtrap.io";
            var port = int.Parse(_config["EmailSettings:Port"] ?? "587");
            var username = _config["EmailSettings:Username"] ?? "";
            var password = _config["EmailSettings:Password"] ?? "";
            var from = _config["EmailSettings:From"] ?? "noreply@kanyonetim.com";

            var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(from, "Hayat Ağı"),
                Subject = subject,
                Body = message,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
        }
    }
}
