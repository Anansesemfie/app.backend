import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import periodService from "../services/periodService";
import appConfigService from "../services/admin/appConfigService";
import HELPERS from "../utils/helpers";
import { REDIS_URL } from "../utils/env";

const PERIOD_QUEUE_NAME = "period-automation";

/**
 * BullMQ requires a separate connection for workers and queues.
 * ioredis is used for this purpose.
 * Note: maxRetriesPerRequest must be null for BullMQ.
 */
const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

// 1. Initialize the Queue
export const periodQueue = new Queue(PERIOD_QUEUE_NAME, { connection });

// 2. Initialize the Worker
export const periodWorker = new Worker(
  PERIOD_QUEUE_NAME,
  async (job) => {
    if (job.name === "monthly-period-creation") {
      try {
        const isEnabled = await appConfigService.isAutoPeriodCreationEnabled();

        if (!isEnabled) {
          HELPERS.LOG("Period auto-creation is disabled. Skipping monthly job.");
          return;
        }

        HELPERS.LOG("Running monthly period auto-creation job (BullMQ)…");
        const created = await periodService.create();
        HELPERS.LOG(`Period created via BullMQ: ${JSON.stringify(created)}`);
      } catch (error) {
        console.error("Monthly period job (BullMQ) failed:", error);
        throw error; // Throwing allows BullMQ to handle retries
      }
    }
  },
  { connection }
);

// Optional: Listen for queue events
const queueEvents = new QueueEvents(PERIOD_QUEUE_NAME, { connection });

periodWorker.on("completed", (job) => {
  HELPERS.LOG(`Job ${job.id} has completed!`);
});

periodWorker.on("failed", (job, err) => {
  HELPERS.LOG(`Job ${job?.id} has failed with ${err.message}`);
});

/**
 * Registers a repeatable job that fires at 00:00 on the 1st of every month.
 * This replaces the node-cron implementation.
 */
export async function startPeriodJob(): Promise<void> {
  try {
    // Add repeatable job
    // pattern: "0 0 1 * *" → at 00:00 on day 1 of every month
    await periodQueue.add(
      "monthly-period-creation",
      {},
      {
        repeat: {
          pattern: "0 0 1 * *",
        },
        jobId: "monthly-period-creation-job", // Static ID to avoid duplicates
      }
    );

    HELPERS.LOG(
      "Monthly period job scheduled via BullMQ (fires on 1st of each month at 00:00)."
    );
  } catch (error) {
    console.error("Failed to schedule monthly period job via BullMQ:", error);
  }
}
