# Anansesemfie API Audit & Roadmap

**Date:** 2026-05-10
**Author:** Gemini CLI

This document outlines the current state of the Anansesemfie API, identifies missing endpoints required for the frontend apps, and highlights existing endpoints that require logic improvements.

---

## 1. Missing Endpoints (New Features)

These endpoints are required to support standard features in the consumer and admin frontend applications.

### 1.1 Consumer App
| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/user/me` | `GET` | Yes | Returns the current user's profile and subscription details based on the session token. Essential for SPA state hydration. |
| `/user/profile` | `PUT` | Yes | Allows users to update their `username`, `bio`, and `dp` (display picture URL). |
| `/user/history` | `GET` | Yes | Paginated list of books the user has recently played, sourced from the `Seen` collection. |
| `/book/continue` | `GET` | Yes | Returns the last played chapter and timestamp for a specific book or the user's overall last activity. |
| `/book/trending` | `GET` | No | Returns books sorted by play/view counts (meta data) for the "Discover" section. |
| `/user/change-password` | `PUT` | Yes | Security feature for logged-in users to update their password. |

### 1.2 Admin App
| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/admin/category` | `POST` | Yes | Create a new book category. |
| `/admin/category/:id` | `PUT/DELETE` | Yes | Update or delete existing categories. |
| `/admin/user/:id/subscription` | `PUT` | Yes | Manually adjust, activate, or extend a user's subscription (for support cases). |
| `/admin/book/:id/chapters/sort` | `PUT` | Yes | Update the display order of chapters for a book. |
| `/admin/quote` | `GET/POST` | Yes | List and create "Quotes of the Day". |
| `/admin/quote/:id` | `GET/PATCH/DELETE` | Yes | Manage individual quotes. |

---

## 2. Endpoints Needing Improvement

### 2.1 Reaction Logic (`/book/reaction/like/:bookId`)
**Current Issue:** 
- The `createReaction` service always creates a new record in the database.
- The `Reaction` model allows multiple entries for the same user and book.
- Calling "Like" multiple times results in multiple likes in the database instead of toggling.
- Logic for switching from "Like" to "Dislike" is separated from the creation logic, leading to duplicate entries of different types.

**Proposed Fix:**
- Implement a "Find or Update/Delete" pattern.
- If a reaction exists with the same action: **Delete it** (Toggle off).
- If a reaction exists with a different action: **Update it** (Switch like to dislike).
- If no reaction exists: **Create it**.

### 2.2 Book Metadata Consistency
**Current Issue:**
- Book `meta` counts (`likes`, `plays`, `comments`) are updated manually in various services. 
- There is a risk of desynchronization between the actual records in `Reaction`/`Comment` collections and the `Book.meta` counters.

**Proposed Fix:**
- Use Mongoose middleware (`post save/remove`) or a central `SyncMeta` utility to ensure counters always match the truth in sub-collections.

### 2.3 Chapter Ordering & Deletion
**Current Issue:**
- Chapters lack an `order` field, making it impossible for the frontend to reliably list them (e.g., Chapter 1, Chapter 2).
- `chapterRepository.bulkDelete` uses `bookId` in the query, but the schema uses `book`. This causes orphaned chapters when a book is deleted.

**Proposed Fix:**
- Add `order: number` to the `Chapter` schema.
- Fix the `bulkDelete` query in the repository.

### 2.4 Search & Filtering
**Current Issue:**
- `getBooks` controller uses a regex on `undefined` if no search query is provided, which is inefficient.
- `filterBooks` doesn't support pagination properly in the current implementation.

**Proposed Fix:**
- Sanitize search inputs and only apply `$regex` if a string is provided.
- Implement standardized pagination across all list endpoints.

---

## 3. Technical Debt & Bugs

1.  **Duplicate Logics**: `playService` has `unAuthorizedUserPlay` and `authorizedUserPlay` with duplicated logic for fetching fallback "Sample" chapters.
2.  **Hardcoded Strings**: "sample" chapter detection is case-sensitive in some places and case-insensitive in others.
3.  **Missing Error Handling**: Some repository methods throw generic errors that lose the original database error context.
