const { Client, Collection } = require("discord.js");

const client = new Client({
    intents: ["Guilds", "GuildMessages", "GuildMembers", "MessageContent"],
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.config = require("../config.json");

module.exports = client;
