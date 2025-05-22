using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Text;
using TodoApp.Data;
using TodoApp.Models;
using TodoApp.Services;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


namespace TodoApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly MongoDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(MongoDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            try
            {

                if (string.IsNullOrWhiteSpace(user.Username))
                {
                    return BadRequest(new {message="User Name is Required"});
                }
                if (string.IsNullOrWhiteSpace(user.Email))
                {
                    return BadRequest(new { message = "Email is Required" });
                }
                if (string.IsNullOrWhiteSpace(user.Password))
                {
                    return BadRequest(new { message = "Password is Required" });
                }

                if ((await _context.Users.FindAsync(u => u.Email == user.Email)).Any())
                    return BadRequest(new {message =  "Email already registered" });

                user.PasswordHash = HashPassword(user.Password);
                user.Password = null;
                await _context.Users.InsertOneAsync(user);

                var token = _jwtService.GenerateToken(user);
                return Ok(new
                {
                    success = true,
                    message = "User registered successfully",
                    token = token,
                    user = new
                    {
                        id = user.Id,
                        username = user.Username,
                        email = user.Email
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, "Internal server problem when trying to register");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User login)
        {
            try
            {

                if (string.IsNullOrWhiteSpace(login.Email))
                {
                    return BadRequest(new { message = "Email is required." });
                }

                if (string.IsNullOrWhiteSpace(login.Password))
                {
                    return BadRequest(new { message = "Password is required." });
                }

                var user = (await _context.Users.FindAsync(u => u.Email == login.Email)).FirstOrDefault();
                if (user == null || !VerifyPassword(login.Password, user.PasswordHash))
                    return Unauthorized(new { meaasge = "Invalid credentials" });

                var token = _jwtService.GenerateToken(user);

                return Ok(new
                {
                    success = true,
                    message = "Login Successfull",
                    token = token,
                    user = new
                    {
                        id = user.Id,
                        username = user.Username,
                        email = user.Email
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, "Internal server problem when trying to login");
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetUser()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest(new { message = "Invalid token: No user ID found." });
                }

                var user = (await _context.Users.FindAsync(u => u.Id == userId)).FirstOrDefault();
                if (user == null)
                {
                    return BadRequest(new { message = "User not found." });
                }

                return Ok(new
                {
                    message = "Get The User",
                    success = true,
                    user = new
                    {
                        id = user.Id,
                        username = user.Username,
                        email = user.Email
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in user retrieval:", ex);
                return StatusCode(500, new { message = "Internal Server Error on User retrieval", error = ex.Message });
            }
        }



        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hash);
        }

        private bool VerifyPassword(string input, string storedHash)
        {
            return HashPassword(input) == storedHash;
        }
    }
}
