"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPeriodJob = startPeriodJob;
const node_cron_1 = __importDefault(require("node-cron"));
const periodService_1 = __importDefault(require("../services/periodService"));
const appConfigService_1 = __importDefault(require("../services/admin/appConfigService"));
const helpers_1 = __importDefault(require("../utils/helpers"));
/**
 * Registers a cron job that fires at 00:00 on the 1st of every month.
 *
 * When autoPeriodCreation is enabled, the job deactivates the current period
 * and creates a new one for the incoming month (mirrors what periodService.create()
 * already does when called with no arguments).
 *
 * When autoPeriodCreation is disabled the job logs a skip message and returns
 * without touching the database — admins must create the period manually via
 * POST /admin/period/create.
 *
 * Call this function once, after the MongoDB connection is established.
 */
function startPeriodJob() {
    // "0 0 1 * *" → at 00:00 on day 1 of every month
    node_cron_1.default.schedule("0 0 1 * *", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const isEnabled = yield appConfigService_1.default.isAutoPeriodCreationEnabled();
            if (!isEnabled) {
                helpers_1.default.LOG("Period auto-creation is disabled. Skipping monthly job.");
                return;
            }
            helpers_1.default.LOG("Running monthly period auto-creation job…");
            const created = yield periodService_1.default.create();
            helpers_1.default.LOG(`Period created: ${JSON.stringify(created)}`);
        }
        catch (error) {
            console.error("Monthly period job failed:", error);
        }
    }));
    helpers_1.default.LOG("Monthly period job scheduled (fires on 1st of each month at 00:00).");
}
