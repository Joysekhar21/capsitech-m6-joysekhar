using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;
using TodoApp.Data;
using TodoApp.Models;

namespace TodoApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TodoController : ControllerBase
    {
        private readonly MongoDbContext _context;

        public TodoController(MongoDbContext context)
        {
            _context = context;
        }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] string sort = "desc")
        {
            try
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest(new { message = "Token not found or invalid." });
                }

                const int pageSize = 6;
                var skip = (page - 1) * pageSize;

                var totalTodos = await _context.Todos.CountDocumentsAsync(t => t.UserId == userId);
                var totalPages = (int)Math.Ceiling((double)totalTodos / pageSize);

                var sortDefinition = sort.ToLower() == "asc"
                    ? Builders<Todo>.Sort.Ascending(t => t.CreatedAt)
                    : Builders<Todo>.Sort.Descending(t => t.CreatedAt);

                var todos = await _context.Todos
                    .Find(t => t.UserId == userId)
                    .Sort(sortDefinition)
                    .Skip(skip)
                    .Limit(pageSize)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Todos fetched successfully",
                    todos,
                    pagination = new
                    {
                        currentPage = page,
                        totalPages,
                        totalTodos,
                        pageSize,
                        sortOrder = sort
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new { success = false, error = "Internal server error while fetching todos." });
            }
        }



        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string? query)
        {
            try
            {
                var userId = GetUserId();

                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest(new { message = "Token not found or invalid." });
                }

                if (string.IsNullOrWhiteSpace(query))
                {
                    return BadRequest(new { message = "Search query is required." });
                }

                var filterBuilder = Builders<Todo>.Filter;
                var filter = filterBuilder.Eq(t => t.UserId, userId) &
                             (filterBuilder.Regex(t => t.Title, new MongoDB.Bson.BsonRegularExpression(query, "i")) |
                              filterBuilder.Regex(t => t.Description, new MongoDB.Bson.BsonRegularExpression(query, "i")));

                var todos = await _context.Todos.Find(filter).ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Search results fetched successfully",
                    total = todos.Count,
                    todos
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error during search: " + ex);
                return StatusCode(500, new { message = "Internal Server Error during search", error = ex.Message });
            }
        }

        


        [HttpPost]
        public async Task<IActionResult> Create(Todo todo)
        {
            try
            {
                var userId = GetUserId();

                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest(new { message = "Token not found." });
                }

                if (string.IsNullOrWhiteSpace(todo.Title) || string.IsNullOrWhiteSpace(todo.Description))
                {
                    return BadRequest(new { message = "Title and Description are required." });
                }

                todo.UserId = userId;
                todo.Completed ??= false;

                await _context.Todos.InsertOneAsync(todo);

                if (todo == null)
                {
                    return StatusCode(500, new { message = "Something went wrong while creating the todo." });
                }

                return Ok(new
                {
                    success = true,
                    todo,
                    message = "Todo created successfully"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in todo creation: ", ex);
                return StatusCode(500, new { message = "Internal server error during todo creation", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id,[FromBody] Todo updated)
        {
            try
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest(new { message = "Token not found." });
                }

                // Check if required fields are present
                var hasValidFields = !string.IsNullOrWhiteSpace(updated.Title) ||
                                     !string.IsNullOrWhiteSpace(updated.Description) ||
                                     updated.Completed != null;

                if (!hasValidFields || string.IsNullOrEmpty(id))
                {
                    return BadRequest(new
                    {
                        message = "todo_id / description / title  is required"
                    });
                }

                var todo = await _context.Todos.Find(t => t.Id == id).FirstOrDefaultAsync();
                if (todo == null)
                {
                    return NotFound(new { message = "Todo not found." });
                }

                if (todo.UserId != userId)
                {
                    return Unauthorized(new { message = "Unauthorized request." });
                }

                // Update only if values are provided
                if (!string.IsNullOrWhiteSpace(updated.Description))
                    todo.Description = updated.Description;

                if (!string.IsNullOrWhiteSpace(updated.Title))
                    todo.Title = updated.Title;

                // Only update `Completed` if it's provided
                if (updated.Completed.HasValue)
                    todo.Completed = updated.Completed.Value;

                await _context.Todos.ReplaceOneAsync(t => t.Id == id, todo);

                return Ok(new
                {
                    success = true,
                    todo,
                    message = "Todo updated successfully"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in update todo: " + ex);
                return StatusCode(500, new
                {
                    message = "Internal Server Error on update todo",
                    error = ex.Message
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var userId = GetUserId();

                
                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest(new { message = "Token not found" });
                }

                
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest(new { message = "Todo ID is required" });
                }

                
                var todo = await _context.Todos.Find(t => t.Id == id).FirstOrDefaultAsync();
                if (todo == null)
                {
                    return NotFound(new { message = "Todo not found" });
                }

                if (todo.UserId != userId)
                {
                    return Unauthorized(new { message = "Unauthorized request" });
                }

              
                var result = await _context.Todos.DeleteOneAsync(t => t.Id == id && t.UserId == userId);
                if (result.DeletedCount == 0)
                {
                    return StatusCode(500, new { message = "Something went wrong while deleting todo" });
                }

                
                return Ok(new
                {
                    success = true,
                    message = "Todo deleted successfully"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in deleting todo: " + ex);
                return StatusCode(500, new
                {
                    message = "Internal Server Error on delete todo",
                    error = ex.Message
                });
            }
        }

    }
}
