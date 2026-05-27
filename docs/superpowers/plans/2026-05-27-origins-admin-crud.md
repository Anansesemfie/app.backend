# Origins Admin CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build admin REST endpoints to create, list, get, update, and toggle-active Origins — the country/region records that subscription plans reference via their required `origin` field.

**Architecture:** Follows the existing layer pattern: Route → REQUIREAUTH middleware → Controller → Service → Repository → Model. The `Origin` Mongoose model already exists and is exported from `src/db/models/index.ts`. We add the four missing layers (repository, service, controller, route) and mount the route in the admin index.

**Tech Stack:** TypeScript, Express, Mongoose, existing `CustomError`/`CustomErrorHandler`, `sessionService` for admin guard, `ErrorEnum`/`ErrorCodes` for error codes.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/dto/index.ts` | Add `OriginType` and `OriginCurrencyType` |
| Create | `src/db/repository/originsRepository.ts` | DB access — create, findAll, findById, update |
| Create | `src/services/admin/originsService.ts` | Business logic + admin guard |
| Create | `src/controllers/admin/originsController.ts` | Thin Express handlers |
| Create | `src/api/routes/admin/OriginsRoute.ts` | Route definitions |
| Modify | `src/api/routes/admin/index.ts` | Mount `/origin` route |

---

### Task 1: Add OriginType to the DTO

**Files:**
- Modify: `src/dto/index.ts`

- [ ] **Step 1: Open `src/dto/index.ts` and append the new types after the last export**

  Add at the bottom of the file:

  ```typescript
  export type OriginCurrencyType = {
    name?: string;
    symbol?: string;
  };

  export type OriginType = {
    _id?: string;
    name: string;
    flag: string;
    currency?: OriginCurrencyType;
    active?: boolean;
    createdAt?: string;
  };
  ```

- [ ] **Step 2: Build to confirm no type errors**

  ```bash
  npm run build
  ```

  Expected: exits 0, no errors printed.

- [ ] **Step 3: Commit**

  ```bash
  git add src/dto/index.ts
  git commit -m "feat: add OriginType and OriginCurrencyType to DTO"
  ```

---

### Task 2: Create Origins repository

**Files:**
- Create: `src/db/repository/originsRepository.ts`

- [ ] **Step 1: Create the file**

  ```typescript
  // src/db/repository/originsRepository.ts
  import { Origin } from "../models";
  import type { OriginType } from "../../dto";

  class OriginsRepository {
    async create(data: OriginType): Promise<OriginType> {
      return await Origin.create(data);
    }

    async findAll(): Promise<OriginType[]> {
      return await Origin.find({}).select("-__v").lean();
    }

    async findById(id: string): Promise<OriginType | null> {
      return await Origin.findById(id).select("-__v").lean();
    }

    async update(id: string, data: Partial<OriginType>): Promise<OriginType | null> {
      return await Origin.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      )
        .select("-__v")
        .lean();
    }
  }

  export default new OriginsRepository();
  ```

- [ ] **Step 2: Build**

  ```bash
  npm run build
  ```

  Expected: exits 0.

- [ ] **Step 3: Commit**

  ```bash
  git add src/db/repository/originsRepository.ts
  git commit -m "feat: add origins repository"
  ```

---

### Task 3: Create Origins admin service

**Files:**
- Create: `src/services/admin/originsService.ts`

- [ ] **Step 1: Create the file**

  ```typescript
  // src/services/admin/originsService.ts
  import originsRepository from "../../db/repository/originsRepository";
  import sessionService from "../sessionService";
  import CustomError, { ErrorCodes } from "../../utils/CustomError";
  import { ErrorEnum } from "../../utils/error";
  import { UsersTypes } from "../../db/models/utils";
  import type { OriginType } from "../../dto";

  class AdminOriginsService {
    private async assertAdmin(token: string) {
      const { user } = await sessionService.getSession(token);
      if (!user || user.account !== UsersTypes.admin) {
        throw new CustomError(ErrorEnum[403], "Forbidden", ErrorCodes.FORBIDDEN);
      }
    }

    async list(token: string): Promise<OriginType[]> {
      await this.assertAdmin(token);
      return await originsRepository.findAll();
    }

    async getOne(token: string, id: string): Promise<OriginType> {
      await this.assertAdmin(token);
      if (!id) {
        throw new CustomError(ErrorEnum[400], "Origin ID is required", ErrorCodes.BAD_REQUEST);
      }
      const origin = await originsRepository.findById(id);
      if (!origin) {
        throw new CustomError(ErrorEnum[404], "Origin not found", ErrorCodes.NOT_FOUND);
      }
      return origin;
    }

    async create(token: string, data: OriginType): Promise<OriginType> {
      await this.assertAdmin(token);
      if (!data.name || !data.flag) {
        throw new CustomError(
          ErrorEnum[400],
          "Origin name and flag are required",
          ErrorCodes.BAD_REQUEST
        );
      }
      return await originsRepository.create(data);
    }

    async update(token: string, id: string, data: Partial<OriginType>): Promise<OriginType> {
      await this.assertAdmin(token);
      if (!id) {
        throw new CustomError(ErrorEnum[400], "Origin ID is required", ErrorCodes.BAD_REQUEST);
      }
      const updated = await originsRepository.update(id, data);
      if (!updated) {
        throw new CustomError(ErrorEnum[404], "Origin not found", ErrorCodes.NOT_FOUND);
      }
      return updated;
    }

    async toggleActive(token: string, id: string): Promise<OriginType> {
      await this.assertAdmin(token);
      if (!id) {
        throw new CustomError(ErrorEnum[400], "Origin ID is required", ErrorCodes.BAD_REQUEST);
      }
      const origin = await originsRepository.findById(id);
      if (!origin) {
        throw new CustomError(ErrorEnum[404], "Origin not found", ErrorCodes.NOT_FOUND);
      }
      const updated = await originsRepository.update(id, { active: !origin.active });
      return updated!;
    }
  }

  export default new AdminOriginsService();
  ```

- [ ] **Step 2: Build**

  ```bash
  npm run build
  ```

  Expected: exits 0.

- [ ] **Step 3: Commit**

  ```bash
  git add src/services/admin/originsService.ts
  git commit -m "feat: add admin origins service"
  ```

---

### Task 4: Create Origins controller

**Files:**
- Create: `src/controllers/admin/originsController.ts`

- [ ] **Step 1: Create the file**

  ```typescript
  // src/controllers/admin/originsController.ts
  import { Request, Response } from "express";
  import { CustomErrorHandler } from "../../utils/CustomError";
  import originsService from "../../services/admin/originsService";

  export const ListOrigins = async (_req: Request, res: Response) => {
    try {
      const token = res.locals.sessionId;
      const origins = await originsService.list(token);
      res.status(200).json({ data: origins });
    } catch (error) {
      CustomErrorHandler.handle(error, res);
    }
  };

  export const GetOrigin = async (req: Request, res: Response) => {
    try {
      const token = res.locals.sessionId;
      const { id } = req.params;
      const origin = await originsService.getOne(token, id);
      res.status(200).json({ data: origin });
    } catch (error) {
      CustomErrorHandler.handle(error, res);
    }
  };

  export const CreateOrigin = async (req: Request, res: Response) => {
    try {
      const token = res.locals.sessionId;
      const origin = await originsService.create(token, req.body);
      res.status(201).json({ data: origin });
    } catch (error) {
      CustomErrorHandler.handle(error, res);
    }
  };

  export const UpdateOrigin = async (req: Request, res: Response) => {
    try {
      const token = res.locals.sessionId;
      const { id } = req.params;
      const origin = await originsService.update(token, id, req.body);
      res.status(200).json({ data: origin });
    } catch (error) {
      CustomErrorHandler.handle(error, res);
    }
  };

  export const ToggleOriginActive = async (req: Request, res: Response) => {
    try {
      const token = res.locals.sessionId;
      const { id } = req.params;
      const origin = await originsService.toggleActive(token, id);
      res.status(200).json({ data: origin });
    } catch (error) {
      CustomErrorHandler.handle(error, res);
    }
  };
  ```

- [ ] **Step 2: Build**

  ```bash
  npm run build
  ```

  Expected: exits 0.

- [ ] **Step 3: Commit**

  ```bash
  git add src/controllers/admin/originsController.ts
  git commit -m "feat: add admin origins controller"
  ```

---

### Task 5: Create Origins route and mount it

**Files:**
- Create: `src/api/routes/admin/OriginsRoute.ts`
- Modify: `src/api/routes/admin/index.ts`

- [ ] **Step 1: Create the route file**

  ```typescript
  // src/api/routes/admin/OriginsRoute.ts
  import { Router } from "express";
  import {
    CreateOrigin,
    GetOrigin,
    ListOrigins,
    ToggleOriginActive,
    UpdateOrigin,
  } from "../../../controllers/admin/originsController";

  const router = Router();

  router.get("/all", ListOrigins);
  router.get("/:id", GetOrigin);
  router.post("/create", CreateOrigin);
  router.put("/:id", UpdateOrigin);
  router.patch("/:id/toggle", ToggleOriginActive);

  export default router;
  ```

- [ ] **Step 2: Mount the route in `src/api/routes/admin/index.ts`**

  Add the import after the existing imports (e.g. after `import AppConfigRoute from "./AppConfigRoute";`):

  ```typescript
  import Origins from "./OriginsRoute";
  ```

  Add the `router.use` line after the existing mounts (e.g. after `router.use("/settings", REQUIREAUTH, AppConfigRoute);`):

  ```typescript
  router.use("/origin", REQUIREAUTH, Origins);
  ```

- [ ] **Step 3: Build**

  ```bash
  npm run build
  ```

  Expected: exits 0.

- [ ] **Step 4: Commit**

  ```bash
  git add src/api/routes/admin/OriginsRoute.ts src/api/routes/admin/index.ts
  git commit -m "feat: mount admin /origin routes"
  ```

---

## API Reference (after implementation)

All routes are prefixed at `/admin/origin` and require a Bearer JWT (admin account).

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/admin/origin/all` | — | List all origins |
| GET | `/admin/origin/:id` | — | Get a single origin |
| POST | `/admin/origin/create` | `{ name, flag, currency?, active? }` | Create an origin |
| PUT | `/admin/origin/:id` | `{ name?, flag?, currency?, active? }` | Update an origin |
| PATCH | `/admin/origin/:id/toggle` | — | Toggle `active` on/off |

**Create body example:**
```json
{
  "name": "Ghana",
  "flag": "GH",
  "currency": { "name": "Ghanaian Cedi", "symbol": "₵" },
  "active": true
}
```

Once you have an origin `_id` from `GET /admin/origin/all`, use it as the `origin` field when calling `POST /admin/subscriptions/create`.
