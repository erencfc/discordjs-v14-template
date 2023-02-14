const { REST, Routes } = require("discord.js");

module.exports = async (guild) => {
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
    const body = guild.client.commands.map((command) => command.body);
    try {
        await rest.put(
            Routes.applicationGuildCommands(guild.client.user.id, guild.id),
            { body }
        );
    } catch (e) {
        console.log(e);
    }
};
