const Discord = require("discord.js");

module.exports = (client) => {
    process.on("unhandledRejection", (reason, p) => {
        console.log("Unhandled Rejection at: Promise", reason);
    });
    process.on("uncaughtException", (err, origin) => {
        console.log("Uncaught Exception at:", err);
    });
    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log("Uncaught Exception Monitor at:", err);
    });
};
