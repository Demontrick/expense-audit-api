# expense-audit-api

![Backend CI](https://github.com/Demontrick/expense-audit-api/actions/workflows/backend.yml/badge.svg)

A full-stack expense auditing tool that automatically flags suspicious transactions before they reach finance review — duplicate submissions, high-value expenses, and unrecognised vendors.

## Stack

**Backend:** ASP.NET Core 8, EF Core 8, PostgreSQL, JWT authentication, role-based authorization (Admin / Auditor)

**Frontend:** React 19, TypeScript, Vite

**Infra:** GitHub Actions CI

## How it works

Every expense submitted is evaluated by the `AuditService` against three rules:

- **High value** — flags any expense above $5,000
- **Suspicious vendor** — flags known placeholder names (unknown, cash, misc, n/a)
- **Duplicate detection** — flags same vendor + same amount from same submitter within 7 days

Flagged expenses are stored with a `flagReason` field explaining exactly which rules triggered. Auditors see flagged rows highlighted in the dashboard. Admins can delete expenses; Auditors can only read and submit.

## API endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | None | Register user |
| POST | /api/auth/login | None | Login, returns JWT |
| GET | /api/expenses | Any role | Get all expenses, filter by ?flagged=true |
| GET | /api/expenses/{id} | Any role | Get single expense |
| POST | /api/expenses | Any role | Submit expense, auto-audited on creation |
| DELETE | /api/expenses/{id} | Admin only | Delete expense |

## Architecture decisions

**Why EF Core over Dapper?** Simple well-defined schema with version-controlled migrations out of the box — right tradeoff for a team without a dedicated DBA.

**Why RBAC at this scale?** Fintech clients require access control from day one, not retrofitted later. Admin role can delete; Auditor is read and submit only.

**Why flag on write not on read?** Flagging on submission means the audit state is persisted and queryable — a finance team can filter `?flagged=true` without recomputing rules on every request on every request.

**Built with AI-assisted tooling** — Claude and Copilot used throughout development as part of normal workflow, including accelerating the Java-to-C# transition, consistent with how modern engineering teams actually ship.

**What I'd add next:** webhook notifications when flagged expenses cross a threshold, a full audit log table tracking who reviewed each flag, and Azure deployment.

## Running locally

```bash
# Prerequisites: .NET 8 SDK, PostgreSQL, Node 18+

# Backend
cd backend/ExpenseAudit.Api
dotnet restore
dotnet ef database update
dotnet run

# Frontend
cd frontend/expense-audit-ui
npm install
npm run dev
```

Update `appsettings.json` with your PostgreSQL credentials and JWT secret before running.