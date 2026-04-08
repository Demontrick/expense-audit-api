using ExpenseAudit.Api.Data;
using ExpenseAudit.Api.DTOs;
using ExpenseAudit.Api.Models;
using ExpenseAudit.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseAudit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly AuditService _auditService;

    public ExpensesController(AppDbContext db, AuditService auditService)
    {
        _db = db;
        _auditService = auditService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool? flagged)
    {
        var query = _db.Expenses.AsQueryable();

        if (flagged.HasValue)
            query = query.Where(e => e.IsFlagged == flagged.Value);

        var expenses = await query
            .OrderByDescending(e => e.SubmittedAt)
            .Select(e => new ExpenseResponse(
                e.Id, e.Vendor, e.Amount, e.Category,
                e.SubmittedBy, e.SubmittedAt, e.IsFlagged, e.FlagReason))
            .ToListAsync();

        return Ok(expenses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var e = await _db.Expenses.FindAsync(id);
        if (e == null) return NotFound();

        return Ok(new ExpenseResponse(
            e.Id, e.Vendor, e.Amount, e.Category,
            e.SubmittedBy, e.SubmittedAt, e.IsFlagged, e.FlagReason));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateExpenseRequest req)
    {
        var expense = new Expense
        {
            Vendor = req.Vendor,
            Amount = req.Amount,
            Category = req.Category,
            SubmittedBy = req.SubmittedBy
        };

        var existing = await _db.Expenses.ToListAsync();
        _auditService.Evaluate(expense, existing);

        _db.Expenses.Add(expense);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = expense.Id },
            new ExpenseResponse(
                expense.Id, expense.Vendor, expense.Amount, expense.Category,
                expense.SubmittedBy, expense.SubmittedAt, expense.IsFlagged, expense.FlagReason));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var expense = await _db.Expenses.FindAsync(id);
        if (expense == null) return NotFound();

        _db.Expenses.Remove(expense);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}