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
exports.periodWorker = exports.periodQueue = void 0;
exports.startPeriodJob = startPeriodJob;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const periodService_1 = __importDefault(require("../services/periodService"));
const appConfigService_1 = __importDefault(require("../services/admin/appConfigService"));
const helpers_1 = __importDefault(require("../utils/helpers"));
const env_1 = require("../utils/env");
const PERIOD_QUEUE_NAME = "period-automation";
/**
 * BullMQ requires a separate connection for workers and queues.
 * ioredis is used for this purpose.
 * Note: maxRetriesPerRequest must be null for BullMQ.
 */
const connection = new ioredis_1.default(env_1.REDIS_URL, {
    maxRetriesPerRequest: null,
});
// 1. Initialize the Queue
exports.periodQueue = new bullmq_1.Queue(PERIOD_QUEUE_NAME, { connection });
// 2. Initialize the Worker
exports.periodWorker = new bullmq_1.Worker(PERIOD_QUEUE_NAME, (job) => __awaiter(void 0, void 0, void 0, function* () {
    if (job.name === "monthly-period-creation") {
        try {
            const isEnabled = yield appConfigService_1.default.isAutoPeriodCreationEnabled();
            if (!isEnabled) {
                helpers_1.default.LOG("Period auto-creation is disabled. Skipping monthly job.");
                return;
            }
            helpers_1.default.LOG("Running monthly period auto-creation job (BullMQ)…");
            const created = yield periodService_1.default.create();
            helpers_1.default.LOG(`Period created via BullMQ: ${JSON.stringify(created)}`);
        }
        catch (error) {
            console.error("Monthly period job (BullMQ) failed:", error);
            throw error; // Throwing allows BullMQ to handle retries
        }
    }
}), { connection });
// Optional: Listen for queue events
const queueEvents = new bullmq_1.QueueEvents(PERIOD_QUEUE_NAME, { connection });
exports.periodWorker.on("completed", (job) => {
    helpers_1.default.LOG(`Job ${job.id} has completed!`);
});
exports.periodWorker.on("failed", (job, err) => {
    helpers_1.default.LOG(`Job ${job === null || job === void 0 ? void 0 : job.id} has failed with ${err.message}`);
});
/**
 * Registers a repeatable job that fires at 00:00 on the 1st of every month.
 * This replaces the node-cron implementation.
 */
function startPeriodJob() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Add repeatable job
            // pattern: "0 0 1 * *" → at 00:00 on day 1 of every month
            yield exports.periodQueue.add("monthly-period-creation", {}, {
                repeat: {
                    pattern: "0 0 1 * *",
                },
                jobId: "monthly-period-creation-job", // Static ID to avoid duplicates
            });
            helpers_1.default.LOG("Monthly period job scheduled via BullMQ (fires on 1st of each month at 00:00).");
        }
        catch (error) {
            console.error("Failed to schedule monthly period job via BullMQ:", error);
        }
    });
}
