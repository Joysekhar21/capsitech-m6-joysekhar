using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace TodoApp.Models
{
    public class Todo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? Title { get; set; }
        public string? Description { get; set; }

        public bool? Completed { get; set; }

        public string UserId { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
