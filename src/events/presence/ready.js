const { ActivityType } = require("discord.js");

module.exports = (client) => {
    client.user.setPresence({
        status: "idle",
        activities: [
            { name: "Developed by KLeesD!", type: ActivityType.Competing },
        ],
    });
    console.log(`${client.user.tag} is online!`);
};
