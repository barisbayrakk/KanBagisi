using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using KanYonetim.API.Data;
using KanYonetim.API.Models;
using KanYonetim.API.Models.DTOs;
using KanYonetim.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanYonetim.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SupportController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public SupportController(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        private int GetCurrentUserId()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (claim == null) throw new UnauthorizedAccessException();
            return int.Parse(claim.Value);
        }

        private string GetCurrentUserRole()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            return claim?.Value ?? "Donor";
        }

        [HttpPost("tickets")]
        public async Task<ActionResult<SupportTicketDto>> CreateTicket(CreateTicketDto dto)
        {
            var userId = GetCurrentUserId();
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            if (string.IsNullOrWhiteSpace(dto.Subject))
                return BadRequest("Konu boş olamaz.");

            if (string.IsNullOrWhiteSpace(dto.MessageText))
                return BadRequest("Destek mesajı boş olamaz.");

            var ticket = new SupportTicket
            {
                UserId = userId,
                Subject = dto.Subject,
                Status = "Open",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.SupportTickets.Add(ticket);
            await _context.SaveChangesAsync();

            var message = new SupportMessage
            {
                SupportTicketId = ticket.Id,
                SenderId = userId,
                MessageText = dto.MessageText,
                CreatedAt = DateTime.UtcNow
            };

            _context.SupportMessages.Add(message);
            await _context.SaveChangesAsync();

            // SMTP/Mailtrap Bildirimleri Gönder
            try
            {
                // Kullanıcıya onay gönder
                var userMailBody = $@"
                    <h2>Hayat Ağı - Destek Talebi Onayı</h2>
                    <p>Merhaba {user.FullName},</p>
                    <p>Destek talebiniz başarıyla oluşturulmuştur.</p>
                    <p><strong>Talep Numarası:</strong> #{ticket.Id}</p>
                    <p><strong>Konu:</strong> {ticket.Subject}</p>
                    <p><strong>Mesajınız:</strong> {dto.MessageText}</p>
                    <hr />
                    <p>Destek ekibimiz en kısa sürede talebinizi inceleyip size yanıt verecektir.</p>
                ";
                await _emailService.SendEmailAsync(user.Email, $"Destek Talebi Onayı - #{ticket.Id}", userMailBody);

                // Yöneticilere bildirim gönder
                var adminEmail = await _context.Users.Where(u => u.Role == "Admin").Select(u => u.Email).FirstOrDefaultAsync() ?? "admin@kanyonetim.com";
                var adminMailBody = $@"
                    <h2>Hayat Ağı - Yeni Destek Talebi</h2>
                    <p>Yönetici Paneline yeni bir destek talebi ulaştı.</p>
                    <p><strong>Talep Numarası:</strong> #{ticket.Id}</p>
                    <p><strong>Gönderen:</strong> {user.FullName} ({user.Email})</p>
                    <p><strong>Konu:</strong> {ticket.Subject}</p>
                    <p><strong>Mesaj:</strong> {dto.MessageText}</p>
                ";
                await _emailService.SendEmailAsync(adminEmail, $"Yeni Destek Talebi - #{ticket.Id}", adminMailBody);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Email sending failed on ticket creation: " + ex.Message);
            }

            return Ok(new SupportTicketDto
            {
                Id = ticket.Id,
                UserId = ticket.UserId,
                UserName = user.FullName,
                UserEmail = user.Email,
                Subject = ticket.Subject,
                Status = ticket.Status,
                CreatedAt = ticket.CreatedAt,
                UpdatedAt = ticket.UpdatedAt,
                Messages = new List<SupportMessageDto>
                {
                    new SupportMessageDto
                    {
                        Id = message.Id,
                        TicketId = message.SupportTicketId,
                        SenderId = message.SenderId,
                        SenderName = user.FullName,
                        SenderRole = user.Role,
                        MessageText = message.MessageText,
                        CreatedAt = message.CreatedAt
                    }
                }
            });
        }

        [HttpGet("tickets")]
        public async Task<ActionResult<IEnumerable<SupportTicketDto>>> GetTickets()
        {
            var userId = GetCurrentUserId();
            var role = GetCurrentUserRole();

            IQueryable<SupportTicket> query = _context.SupportTickets
                .Include(t => t.User)
                .Include(t => t.Messages)
                    .ThenInclude(m => m.Sender);

            if (role != "Admin" && role != "SubAdmin")
            {
                query = query.Where(t => t.UserId == userId);
            }

            var tickets = await query
                .OrderByDescending(t => t.UpdatedAt)
                .ToListAsync();

            var result = tickets.Select(t => new SupportTicketDto
            {
                Id = t.Id,
                UserId = t.UserId,
                UserName = t.User?.FullName ?? "Bilinmeyen Kullanıcı",
                UserEmail = t.User?.Email ?? "",
                Subject = t.Subject,
                Status = t.Status,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                Messages = t.Messages
                    .OrderBy(m => m.CreatedAt)
                    .Select(m => new SupportMessageDto
                    {
                        Id = m.Id,
                        TicketId = m.SupportTicketId,
                        SenderId = m.SenderId,
                        SenderName = m.Sender?.FullName ?? "Bilinmeyen",
                        SenderRole = m.Sender?.Role ?? "Donor",
                        MessageText = m.MessageText,
                        CreatedAt = m.CreatedAt
                    }).ToList()
            });

            return Ok(result);
        }

        [HttpGet("tickets/{ticketId}")]
        public async Task<ActionResult<SupportTicketDto>> GetTicket(int ticketId)
        {
            var userId = GetCurrentUserId();
            var role = GetCurrentUserRole();

            var ticket = await _context.SupportTickets
                .Include(t => t.User)
                .Include(t => t.Messages)
                    .ThenInclude(m => m.Sender)
                .FirstOrDefaultAsync(t => t.Id == ticketId);

            if (ticket == null) return NotFound("Destek talebi bulunamadı.");

            if (role != "Admin" && role != "SubAdmin" && ticket.UserId != userId)
                return Forbid();

            return Ok(new SupportTicketDto
            {
                Id = ticket.Id,
                UserId = ticket.UserId,
                UserName = ticket.User?.FullName ?? "Bilinmeyen Kullanıcı",
                UserEmail = ticket.User?.Email ?? "",
                Subject = ticket.Subject,
                Status = ticket.Status,
                CreatedAt = ticket.CreatedAt,
                UpdatedAt = ticket.UpdatedAt,
                Messages = ticket.Messages
                    .OrderBy(m => m.CreatedAt)
                    .Select(m => new SupportMessageDto
                    {
                        Id = m.Id,
                        TicketId = m.SupportTicketId,
                        SenderId = m.SenderId,
                        SenderName = m.Sender?.FullName ?? "Bilinmeyen",
                        SenderRole = m.Sender?.Role ?? "Donor",
                        MessageText = m.MessageText,
                        CreatedAt = m.CreatedAt
                    }).ToList()
            });
        }

        [HttpPost("tickets/{ticketId}/messages")]
        public async Task<ActionResult<SupportMessageDto>> CreateMessage(int ticketId, CreateMessageDto dto)
        {
            var userId = GetCurrentUserId();
            var role = GetCurrentUserRole();

            var ticket = await _context.SupportTickets
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == ticketId);

            if (ticket == null) return NotFound("Destek talebi bulunamadı.");

            if (role != "Admin" && role != "SubAdmin" && ticket.UserId != userId)
                return Forbid();

            if (string.IsNullOrWhiteSpace(dto.MessageText))
                return BadRequest("Mesaj boş olamaz.");

            var message = new SupportMessage
            {
                SupportTicketId = ticketId,
                SenderId = userId,
                MessageText = dto.MessageText,
                CreatedAt = DateTime.UtcNow
            };

            ticket.UpdatedAt = DateTime.UtcNow;

            if (role == "Admin" || role == "SubAdmin")
            {
                ticket.Status = "Answered";
            }
            else
            {
                ticket.Status = "Open";
            }

            _context.SupportMessages.Add(message);
            await _context.SaveChangesAsync();

            var sender = await _context.Users.FindAsync(userId);

            // E-posta Bildirimleri Gönder
            try
            {
                if (role == "Admin" || role == "SubAdmin")
                {
                    // Kullanıcıya yöneticinin yanıtladığını bildiren e-posta
                    var userMailBody = $@"
                        <h2>Hayat Ağı - Destek Talebi Yanıtı</h2>
                        <p>Merhaba {ticket.User?.FullName},</p>
                        <p><strong>#{ticket.Id}</strong> numaralı destek talebinize yeni bir yanıt yazıldı.</p>
                        <p><strong>Yönetici Yanıtı:</strong> {dto.MessageText}</p>
                        <hr />
                        <p>Talebinizin detaylarını görmek ve cevap yazmak için platforma giriş yapabilirsiniz.</p>
                    ";
                    await _emailService.SendEmailAsync(ticket.User?.Email ?? "", $"Destek Talebi Yanıtı - #{ticket.Id}", userMailBody);

                    var notification = new Notification
                    {
                        UserId = ticket.UserId,
                        Title = $"Destek Talebi Yanıtı - #{ticket.Id}",
                        Message = "Talebinize yeni bir yanıt geldi.",
                        Type = "Info",
                        CreatedAt = DateTime.UtcNow,
                        IsRead = false
                    };
                    _context.Notifications.Add(notification);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    // Yöneticiye kullanıcının yanıtladığını bildiren e-posta
                    var adminEmail = await _context.Users.Where(u => u.Role == "Admin").Select(u => u.Email).FirstOrDefaultAsync() ?? "admin@kanyonetim.com";
                    var adminMailBody = $@"
                        <h2>Hayat Ağı - Destek Talebinde Yeni Mesaj</h2>
                        <p><strong>#{ticket.Id}</strong> numaralı destek talebinde kullanıcıdan yeni bir mesaj var.</p>
                        <p><strong>Gönderen:</strong> {sender?.FullName} ({sender?.Email})</p>
                        <p><strong>Mesajı:</strong> {dto.MessageText}</p>
                    ";
                    await _emailService.SendEmailAsync(adminEmail, $"Destek Talebi Yeni Mesaj - #{ticket.Id}", adminMailBody);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Email sending failed on ticket reply: " + ex.Message);
            }

            return Ok(new SupportMessageDto
            {
                Id = message.Id,
                TicketId = message.SupportTicketId,
                SenderId = message.SenderId,
                SenderName = sender?.FullName ?? "Bilinmeyen",
                SenderRole = sender?.Role ?? "Donor",
                MessageText = message.MessageText,
                CreatedAt = message.CreatedAt
            });
        }

        [HttpPut("tickets/{ticketId}/status")]
        public async Task<IActionResult> UpdateStatus(int ticketId, UpdateTicketStatusDto dto)
        {
            var userId = GetCurrentUserId();
            var role = GetCurrentUserRole();

            var ticket = await _context.SupportTickets
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == ticketId);

            if (ticket == null) return NotFound("Destek talebi bulunamadı.");

            if (role != "Admin" && role != "SubAdmin" && ticket.UserId != userId)
                return Forbid();

            var validStatuses = new[] { "Open", "Answered", "Resolved", "Closed" };
            if (!validStatuses.Contains(dto.Status))
                return BadRequest("Geçersiz talep durumu.");

            ticket.Status = dto.Status;
            ticket.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Kullanıcıya durum güncellemesini bildir (ör. çözüldü/kapalı)
            try
            {
                string statusText = dto.Status switch
                {
                    "Resolved" => "Çözüldü",
                    "Closed" => "Kapatıldı",
                    "Open" => "Yeniden Açıldı",
                    _ => dto.Status
                };

                var mailBody = $@"
                    <h2>Hayat Ağı - Destek Talebi Durum Güncellemesi</h2>
                    <p>Merhaba {ticket.User?.FullName},</p>
                    <p><strong>#{ticket.Id}</strong> numaralı destek talebinizin durumu güncellendi.</p>
                    <p><strong>Yeni Durum:</strong> {statusText}</p>
                ";
                await _emailService.SendEmailAsync(ticket.User?.Email ?? "", $"Destek Talebi Durum Güncellemesi - #{ticket.Id}", mailBody);

                var notification = new Notification
                {
                    UserId = ticket.UserId,
                    Title = $"Destek Talebi Durumu - #{ticket.Id}",
                    Message = $"Talebinizin durumu '{statusText}' olarak güncellendi.",
                    Type = "Info",
                    CreatedAt = DateTime.UtcNow,
                    IsRead = false
                };
                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Email sending failed on status update: " + ex.Message);
            }

            return Ok(new { message = "Destek talebi durumu güncellendi." });
        }
    }
}
