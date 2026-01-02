"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_cron_1 = require("node-cron");
// Schedule a task to run every minute
node_cron_1.default.schedule("* * * * *", function () {
    console.log("Cron job running at ".concat(new Date().toLocaleTimeString()));
});
// Prevent script from exiting immediately
console.log("Cron job scheduled.");
