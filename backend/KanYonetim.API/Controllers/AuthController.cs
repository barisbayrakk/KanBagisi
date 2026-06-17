using KanYonetim.API.Data;
using KanYonetim.API.Models;
using KanYonetim.API.Models.DTOs;
using KanYonetim.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;

namespace KanYonetim.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthController(AppDbContext context, ITokenService tokenService, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _tokenService = tokenService;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(x => x.Email == registerDto.Email.ToLower()))
                return BadRequest("Bu e-posta adresi zaten kullanımda.");

            var verificationCode = new Random().Next(100000, 999999).ToString();

            var user = new User
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email.ToLower(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Tc = registerDto.Tc,
                Phone = registerDto.Phone,
                Gender = registerDto.Gender,
                BloodTypeId = registerDto.BloodTypeId,
                DistrictId = registerDto.DistrictId,
                Role = "Donor",
                IsEmailVerified = false,
                EmailVerificationCode = verificationCode
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Send Email
            var emailBody = $@"
                <h2>Hayat Ağı - Kan Yönetim Sistemi</h2>
                <p>Merhaba {user.FullName},</p>
                <p>Kayıt işleminizi tamamlamak için doğrulama kodunuz:</p>
                <h1 style='letter-spacing: 5px; color: #e11d48;'>{verificationCode}</h1>
            ";
            await _emailService.SendEmailAsync(user.Email, "E-Posta Doğrulama Kodu", emailBody);

            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Tc = user.Tc,
                Phone = user.Phone,
                Gender = user.Gender,
                Role = user.Role,
                BloodType = "", // Can't easily get name without DB query, frontend knows it
                District = "",
                Token = "", // Do not return token yet
                RequiresEmailVerification = true
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .Include(u => u.BloodType)
                .Include(u => u.District)
                .FirstOrDefaultAsync(x => x.Email == loginDto.Email.ToLower());

            if (user == null) return Unauthorized("Geçersiz e-posta veya şifre.");

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                return Unauthorized("Geçersiz e-posta veya şifre.");



            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Tc = user.Tc,
                Phone = user.Phone,
                Gender = user.Gender,
                Role = user.Role,
                BloodType = user.BloodType?.Name ?? "",
                District = user.District?.Name ?? "",
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto verifyDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == verifyDto.Email.ToLower());
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            if (user.IsEmailVerified) return BadRequest("E-posta zaten doğrulanmış.");

            if (user.EmailVerificationCode != verifyDto.Code)
                return BadRequest("Geçersiz doğrulama kodu.");

            user.IsEmailVerified = true;
            user.EmailVerificationCode = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "E-posta başarıyla doğrulandı." });
        }

        [HttpPost("google-login")]
        public async Task<ActionResult<AuthResponseDto>> GoogleLogin([FromBody] GoogleLoginDto googleLoginDto)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(googleLoginDto.Token, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _configuration["GoogleClientId"] }
                });

                var user = await _context.Users
                    .Include(u => u.BloodType)
                    .Include(u => u.District)
                    .FirstOrDefaultAsync(x => x.Email == payload.Email.ToLower());

                if (user == null)
                {
                    // Create a new user if they don't exist
                    user = new User
                    {
                        FullName = payload.Name ?? "Bilinmeyen Kullanıcı",
                        Email = payload.Email.ToLower(),
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
                        Tc = "",
                        Phone = "",
                        Gender = "Belirtmek İstemiyorum",
                        BloodTypeId = 1,
                        DistrictId = 1,
                        Role = "Donor"
                    };
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                    
                    // Reload with includes
                    user = await _context.Users
                        .Include(u => u.BloodType)
                        .Include(u => u.District)
                        .FirstOrDefaultAsync(x => x.Id == user.Id);
                }

                return new AuthResponseDto
                {
                    UserId = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Tc = user.Tc,
                    Phone = user.Phone,
                    Gender = user.Gender,
                    Role = user.Role,
                    BloodType = user.BloodType?.Name ?? "",
                    District = user.District?.Name ?? "",
                    Token = _tokenService.CreateToken(user)
                };
            }
            catch (InvalidJwtException)
            {
                return Unauthorized("Geçersiz Google Token'ı.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Sunucu hatası: " + ex.Message);
            }
        }
    }
}
