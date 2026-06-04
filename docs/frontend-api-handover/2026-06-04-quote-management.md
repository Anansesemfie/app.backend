# Quote Management API (2026-06-04)

This document details the new admin API endpoints for managing "Quotes of the Day".

---

## 1. List All Quotes
`GET /admin/quote`
- **Auth:** Required (Admin)
- **Description:** Returns a paginated list of all quotes.
- **Query Params:**
  - `page` (Default: 1)
  - `limit` (Default: 10)
- **Response (200):**
```json
{
  "data": [
    {
      "id": "665f...",
      "quote": "Success is not final, failure is not fatal...",
      "author": "Winston Churchill",
      "active": true,
      "createdAt": "2026-06-04T..."
    }
  ]
}
```

## 2. Create Quote
`POST /admin/quote`
- **Auth:** Required (Admin)
- **Description:** Creates a new quote.
- **Request Body:**
```json
{
  "quote": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs",
  "active": true
}
```
- **Response (201):** Returns the created quote object.

## 3. Update Quote
`PATCH /admin/quote/:id`
- **Auth:** Required (Admin)
- **Description:** Updates an existing quote.
- **Request Body:** (All fields optional)
```json
{
  "quote": "Updated text",
  "author": "New Author",
  "active": false
}
```
- **Response (203):** Returns the updated quote object.

## 4. Delete Quote
`DELETE /admin/quote/:id`
- **Auth:** Required (Admin)
- **Description:** Permanently deletes a quote.
- **Response (200):**
```json
{
  "data": "Quote deleted successfully"
}
```

## 5. Fetch Single Quote
`GET /admin/quote/:id`
- **Auth:** Required (Admin)
- **Description:** Returns details for a single quote.
- **Response (200):** Returns the quote object.
