import cron from "node-cron";
import periodService from "../services/periodService";
import appConfigService from "../services/admin/appConfigService";
import HELPERS from "../utils/helpers";

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
export function startPeriodJob(): void {
  // "0 0 1 * *" → at 00:00 on day 1 of every month
  cron.schedule("0 0 1 * *", async () => {
    try {
      const isEnabled = await appConfigService.isAutoPeriodCreationEnabled();

      if (!isEnabled) {
        HELPERS.LOG(
          "Period auto-creation is disabled. Skipping monthly job."
        );
        return;
      }

      HELPERS.LOG("Running monthly period auto-creation job…");
      const created = await periodService.create();
      HELPERS.LOG(`Period created: ${JSON.stringify(created)}`);
    } catch (error) {
      console.error("Monthly period job failed:", error);
    }
  });

  HELPERS.LOG(
    "Monthly period job scheduled (fires on 1st of each month at 00:00)."
  );
}
