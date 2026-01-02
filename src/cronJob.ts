import cron from "node-cron";
import { Cron, DateTime } from "effect";
import { Schedule, Effect } from "effect";
import { schedule, runPromise, sync } from "effect/Effect";
import { Console } from "effect";
import { filter } from "effect/Array";

const ecron = Cron.make({
  seconds: [], // Trigger at the start of a minute
  minutes: [], // Trigger at the start of an hour
  hours: [], // Trigger at 4:00 AM
  days: [], // Specific days of the month
  months: [], // No restrictions on the month
  weekdays: [], // No restrictions on the weekday
  tz: DateTime.zoneUnsafeMakeNamed("Europe/Rome"), // Optional time zone
});

const eschedule = Schedule.cron(ecron);
const program = schedule(eschedule)(
  sync(() =>
    console.log(`my Cron job running at ${new Date().toLocaleTimeString()}`)
  )
);
runPromise(program);

const isAmerica = (a: string, _: number) => a.startsWith("America");
console.log(
  JSON.stringify(
    filter<string>(isAmerica)((Intl as any).supportedValuesOf("timeZone")),
    null,
    2
  )
);

// Schedule a task to run every minute
// cron.schedule("* * * * * *", () => {
//   console.log(`Cron job running at ${new Date().toLocaleTimeString()}`);
// });
