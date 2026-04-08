using ExpenseAudit.Api.Models;

namespace ExpenseAudit.Api.Services;

public class AuditService
{
    private static readonly HashSet<string> SuspiciousVendors = new(StringComparer.OrdinalIgnoreCase)
    {
        "unknown", "cash", "misc", "miscellaneous", "n/a"
    };

    private const decimal HighValueThreshold = 5000m;
    private const decimal DuplicateWindow = 0.01m;

    public void Evaluate(Expense expense, IEnumerable<Expense> existing)
    {
        var reasons = new List<string>();

        if (expense.Amount >= HighValueThreshold)
            reasons.Add($"High value expense: {expense.Amount:C}");

        if (SuspiciousVendors.Contains(expense.Vendor))
            reasons.Add($"Suspicious vendor name: '{expense.Vendor}'");

        var duplicate = existing.Any(e =>
            e.SubmittedBy == expense.SubmittedBy &&
            Math.Abs(e.Amount - expense.Amount) <= DuplicateWindow &&
            e.Vendor.Equals(expense.Vendor, StringComparison.OrdinalIgnoreCase) &&
            e.SubmittedAt >= DateTime.UtcNow.AddDays(-7)
        );

        if (duplicate)
            reasons.Add("Possible duplicate submission within 7 days");

        if (reasons.Count > 0)
        {
            expense.IsFlagged = true;
            expense.FlagReason = string.Join("; ", reasons);
        }
    }
}