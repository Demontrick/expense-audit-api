namespace ExpenseAudit.Api.DTOs;

public record CreateExpenseRequest(
    string Vendor,
    decimal Amount,
    string Category,
    string SubmittedBy
);

public record ExpenseResponse(
    int Id,
    string Vendor,
    decimal Amount,
    string Category,
    string SubmittedBy,
    DateTime SubmittedAt,
    bool IsFlagged,
    string? FlagReason
);