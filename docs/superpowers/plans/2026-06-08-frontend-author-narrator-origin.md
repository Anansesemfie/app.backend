# Frontend — Admin+Consumer Pages for Authors, Narrators & Origins

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build admin CRUD pages for Authors, Narrators, and Origins (country/region records), plus wire author/narrator data into consumer-facing book detail and filter screens.

**Context:** The backend already exposes full CRUD APIs for all three entities. The admin frontend has existing patterns for similar entity management (Languages, Organizations). The consumer frontend already has book cards, detail pages, and a filter endpoint that accepts `author` and `narrator` query params — but these aren't wired to any UI.

**Tech Stack:** Whatever frontend framework the project uses (React/Vue/Svelte/etc). This plan is framework-agnostic and focuses on pages, components, API calls, and data flow.

---

## API Reference

### Author Endpoints (Consumer)

| Method | Path | Response |
|---|---|---|
| GET | `/author/?page=&limit=&search=` | `{ data: { page, records, results: Author[] } }` |
| GET | `/author/:id` | `{ data: Author }` |

### Author Endpoints (Admin)

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/admin/author/create` | `{ name, bio?, active? }` | Create |
| GET | `/admin/author/all` | — | List all (paginated, searchable) |
| GET | `/admin/author/:id` | — | Get single |
| PUT | `/admin/author/:id` | `{ name?, bio?, active? }` | Update |
| DELETE | `/admin/author/:id` | — | Delete (blocked if books exist) |

### Narrator Endpoints (Consumer)

| Method | Path | Response |
|---|---|---|
| GET | `/narrator/?page=&limit=&search=` | `{ data: { page, records, results: Narrator[] } }` |
| GET | `/narrator/:id` | `{ data: Narrator }` |

### Narrator Endpoints (Admin)

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/admin/narrator/create` | `{ name, bio?, active? }` | Create |
| GET | `/admin/narrator/all` | — | List all (paginated, searchable) |
| GET | `/admin/narrator/:id` | — | Get single |
| PUT | `/admin/narrator/:id` | `{ name?, bio?, active? }` | Update |
| DELETE | `/admin/narrator/:id` | — | Delete (blocked if books exist) |

### Origin Endpoints (Admin only — no consumer route exists)

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/admin/origin/create` | `{ name, flag, currency?, active? }` | Create |
| GET | `/admin/origin/all` | — | List all |
| GET | `/admin/origin/:id` | — | Get single |
| PUT | `/admin/origin/:id` | `{ name?, flag?, currency?, active? }` | Update |
| PATCH | `/admin/origin/:id/toggle` | — | Toggle active on/off |

### Related Consumer Endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/book/filter/all?author=&narrator=&search=&language=&category=` | `author` and `narrator` accept ObjectId strings |
| GET | `/subscription/` | Returns plans; `origin` field is a raw ObjectId (not populated) |

### Data Types

```typescript
type AuthorType = { _id?: string; name: string; bio?: string; active?: boolean; createdAt?: string };
type AuthorResponseType = { id: string; name: string; bio?: string; active: boolean };

type NarratorType = { _id?: string; name: string; bio?: string; active?: boolean; createdAt?: string };
type NarratorResponseType = { id: string; name: string; bio?: string; active: boolean };

type OriginType = {
  _id?: string; name: string; flag: string;
  currency?: { name?: string; symbol?: string };
  active?: boolean; createdAt?: string;
};

type BookResponseType = {
  id: string; title: string; description: string; cover: string;
  authors: string[];     // populated -> author names; not populated -> ObjectId strings
  narrators: string[];   // same
  category: string[]; languages: string[];
  meta: { played, views, likes, dislikes, comments };
};
```

---

## File Map

| Action | File/Component | Responsibility |
|---|---|---|
| Create | Admin authors page | Table + create/edit/delete for Author |
| Create | Admin narrators page | Table + create/edit/delete for Narrator |
| Create | Admin origins page | Table + create/edit/toggle for Origin |
| Modify | Admin nav/sidebar | Add links to /authors, /narrators, /origins |
| Modify | Book create/edit form | Replace legacy text input with multi-select picker for authors/narrators |
| Modify | Consumer book card | Show author and narrator names |
| Modify | Consumer book detail page | Show author and narrator info |
| Modify | Consumer book filter UI | Add author and narrator filter dropdowns |
| Create | Consumer author detail page | Books by this author |
| Create | Consumer narrator detail page | Books narrated by this person |
| Create | Consumer origin detail page | Show subscription plans available in this origin |
| Modify | Subscription plan cards | Show origin name/flag (resolve via admin origin list since no consumer origin endpoint exists) |

---

## Task 1: Admin — Authors Page

Build a full CRUD management page at `/admin/authors`.

- [ ] **Step 1: Create the authors list page/component**
  - Table columns: Name, Bio (truncated), Active (badge/toggle), Created At, Actions
  - Search field that queries `GET /admin/author/all?search=` (or filter client-side)
  - Pagination if the endpoint returns paginated results

- [ ] **Step 2: Create author form (modal or page)**
  - Fields: `name` (text, required), `bio` (textarea, optional), `active` (toggle, default true)
  - POST `/admin/author/create` on save
  - On success, refresh the list

- [ ] **Step 3: Add edit support**
  - Clicking "Edit" opens the form pre-populated with existing data
  - PUT `/admin/author/:id` on save

- [ ] **Step 4: Add delete with confirmation**
  - DELETE `/admin/author/:id`
  - Show confirmation dialog warning that deletion will fail if books are associated
  - Handle 400/error response gracefully (show "Cannot delete: author has books" message)

---

## Task 2: Admin — Narrators Page

Build a full CRUD management page at `/admin/narrators`. Structurally identical to the Authors page.

- [ ] **Step 1: Create the narrators list page/component**
  - Same columns as authors: Name, Bio, Active, Created At, Actions

- [ ] **Step 2: Create/edit narrator form**
  - Fields: `name` (text, required), `bio` (textarea, optional), `active` (toggle, default true)
  - POST `/admin/narrator/create` / PUT `/admin/narrator/:id`

- [ ] **Step 3: Add delete with confirmation**
  - DELETE `/admin/narrator/:id`
  - Handle "cannot delete: has books" error

---

## Task 3: Admin — Origins Page

Build a management page at `/admin/origins`. Origins have no consumer-facing list endpoint, so the admin page is also used for display/selection in other flows.

- [ ] **Step 1: Create the origins list page/component**
  - Table columns: Name, Flag (show the flag code), Currency (e.g. "GHS ₵"), Active (toggle badge), Created At, Actions
  - `GET /admin/origin/all` — returns all origins

- [ ] **Step 2: Create/edit origin form**
  - Fields: `name` (text, required), `flag` (text, required — country code like "GH"), `currency.name`, `currency.symbol`, `active` (toggle)
  - POST `/admin/origin/create` / PUT `/admin/origin/:id`

- [ ] **Step 3: Add toggle-active button**
  - PATCH `/admin/origin/:id/toggle`
  - Toggle button/switch in the table row that calls this endpoint directly (no form needed)

---

## Task 4: Admin — Navigation

- [ ] **Step 1: Add links in the admin sidebar/nav**
  - `/admin/authors`
  - `/admin/narrators`
  - `/admin/origins`
  - Follow the existing nav pattern (same placement as Languages, Organizations)

---

## Task 5: Admin — Book Create/Edit Form

The current book form has a legacy text input for authors. Replace it with proper multi-select pickers for both authors and narrators.

- [ ] **Step 1: Fetch author and narrator lists on form load**
  - `GET /admin/author/all` and `GET /admin/narrator/all` → populate dropdown options

- [ ] **Step 2: Replace the author text input**
  - Use a multi-select dropdown or tag-style picker showing author names
  - On submit, send author ObjectIds as `authors: string[]`

- [ ] **Step 3: Add a narrator multi-select picker**
  - Same pattern as authors, but optional
  - On submit, send as `narrators: string[]`

---

## Task 6: Consumer — Book Card

Author and narrator names should be visible on book cards/grid items.

- [ ] **Step 1: Update the book card display**
  - The consumer `GET /book/` response returns `authors` as `string[]` (names when populated)
  - Show "By: Author Name" on each card
  - If `narrators` is non-empty, show "Narrated by: Narrator Name"
  - Handle both populated (names) and unpopulated (IDs) cases — display IDs only when names aren't available, but ideally the book endpoint always populates

---

## Task 7: Consumer — Book Detail Page

- [ ] **Step 1: Display author and narrator info prominently**
  - Author(s): linked names → author detail page (`/author/:id`)
  - Narrator(s): linked names → narrator detail page (`/narrator/:id`)
  - Use the full Author/Narrator response from `GET /author/:id` / `GET /narrator/:id` to show bios/supplementary info

- [ ] **Step 2: Add a "More by this author" section**
  - Use `GET /book/filter/all?author=<authorId>` to fetch other books by the same author
  - Show as a horizontal scroll row below the book details

- [ ] **Step 3: Add a "More by this narrator" section** (same pattern)

---

## Task 8: Consumer — Book Filter UI

The existing `GET /book/filter/all` endpoint already supports `author` and `narrator` query params. Wire them into the filter UI.

- [ ] **Step 1: Add author and narrator filter dropdowns**
  - Fetch author list from `GET /author/` and narrator list from `GET /narrator/`
  - Multi-select dropdowns (or single-select, whichever matches existing filter UX)
  - On selection, append `&author=<id>` or `&narrator=<id>` to the filter API call
  - Clearable — removing the selection removes the query param

---

## Task 9: Consumer — Author Detail Page

- [ ] **Step 1: Create `/author/:id` page**
  - Fetch: `GET /author/:id` → author info (name, bio)
  - Fetch: `GET /book/filter/all?author=<id>` → books by this author
  - Render: author header (name + bio) + grid of book cards

---

## Task 10: Consumer — Narrator Detail Page

- [ ] **Step 1: Create `/narrator/:id` page**
  - Fetch: `GET /narrator/:id` → narrator info (name, bio)
  - Fetch: `GET /book/filter/all?narrator=<id>` → books narrated
  - Render: narrator header + grid of book cards

---

## Task 11: Consumer — Origin on Subscription Plans

Subscription plans have an `origin` field (ObjectId) but the consumer endpoint doesn't populate it. Since there's no consumer origin endpoint, use the admin list or pre-fetch.

- [ ] **Step 1: Display origin on plan cards**
  - On the subscription listing page (`/subscriptions`), pre-fetch all origins via `GET /admin/origin/all` (or, if admin auth is required, hardcode a fallback — check whether this endpoint requires admin auth; the origins controller checks for admin)
  - *If admin auth is required for origin list*, resolve origin names by embedding the origin list in the subscription plans response (backend change) or maintain a static mapping
  - Show origin flag + name on each plan card (e.g. "🇬🇭 Ghana")
  - If origin cannot be resolved, fall back to showing the raw ObjectId

> **Backend note:** To fully support the consumer origin display, consider either (a) making `GET /origin/` a public consumer endpoint, or (b) populating the `origin` field in the consumer subscription response. This plan assumes option (a) is chosen — if not, the frontend will need a workaround.

---

## Task 12: Verify All Flows

- [ ] **Step 1: Admin — Create, edit, toggle, delete for each entity**
  - Create an Author, verify it appears in the book create form
  - Create a Narrator, verify it appears in the book create form
  - Create an Origin, verify the toggle-active works
  - Delete an Author that has books → 400 handled gracefully
  - Delete an Author without books → success

- [ ] **Step 2: Admin — Book form**
  - Create a book with multiple authors and narrators selected
  - Verify the book detail page shows names correctly

- [ ] **Step 3: Consumer — Book cards and detail**
  - Browse books, verify author/narrator names display
  - Click author name → navigates to author detail page
  - Author detail page shows correct books filtered by that author

- [ ] **Step 4: Consumer — Filters**
  - Apply author or narrator filter
  - Verify the book list narrows correctly

- [ ] **Step 5: Consumer — Subscriptions**
  - Verify origin is displayed on plan cards (or identify the gap)

---

## Self-Review

### Coverage check

| Requirement | Covered in |
|---|---|
| Admin CRUD for Authors | Task 1 |
| Admin CRUD for Narrators | Task 2 |
| Admin CRUD for Origins | Task 3 |
| Admin nav links | Task 4 |
| Book create/edit with author/narrator pickers | Task 5 |
| Consumer book card shows author/narrator | Task 6 |
| Consumer book detail shows author/narrator with links | Task 7 |
| Book filter by author/narrator | Task 8 |
| Consumer author detail page | Task 9 |
| Consumer narrator detail page | Task 10 |
| Origin on subscription plans | Task 11 |

### Gaps and considerations

- **Consumer origin endpoint:** `GET /admin/origin/all` requires admin auth. The consumer subscription plan list returns `origin` as a raw ObjectId. The frontend needs either a public origin endpoint or a backend change to populate the field. Task 11 calls this out.
- **Population on book list:** Consumer `GET /book/` may return author/narrator as ObjectId strings if not populated (based on repo code — `fetchAll` does NOT populate). If names aren't showing, the backend `fetchAll` method may need a `.populate("authors").populate("narrators")` call. Verify during testing.
- **Delete guard:** Server already prevents deleting authors/narrators linked to books. The frontend should handle the 400 error gracefully with a user-friendly message.
