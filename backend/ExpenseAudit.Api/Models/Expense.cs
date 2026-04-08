namespace ExpenseAudit.Api.Models;

public class Expense
{
    public int Id { get; set; }
    public string Vendor { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Category { get; set; } = string.Empty;
    public string SubmittedBy { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public bool IsFlagged { get; set; } = false;
    public string? FlagReason { get; set; }
}