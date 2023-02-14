const register_commands = require("../../utils/register_commands");

module.exports = (client) => {
    // Register slash commands
    client.guilds.cache.forEach(async (guild) => {
        const commands =
            (await guild.commands.fetch().catch(() => {})) ||
            client.commands.size;
        if (commands.size != client.commands.size) {
            register_commands(guild);
        }
    });
};
