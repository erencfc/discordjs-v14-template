const Discord = require("discord.js");

/**
 * @param {Discord.Client} client
 * @param {Discord.Interaction} interaction
 */

exports.run = async function (client, interaction) {
    const discord_ping = client.ws.ping;
    const bot_ping = Math.abs(Date.now() - interaction.createdTimestamp);
    await interaction.reply({
        embeds: [
            new Discord.EmbedBuilder()
                .setColor("DarkGreen")
                .setDescription(
                    `Discord Latency: **__\`${discord_ping}\`__ ms**\nBot Latency: **__\`${bot_ping}\`__ ms**`
                ),
        ],
    });
};

exports.settings = {
    enabled: true,
    onlyOwner: false,
    perm: "",
    cooldown: 10000,
};

exports.help = {
    name: "ping",
    description: "Shows the latency of the bot.",
};

exports.data = new Discord.SlashCommandBuilder()
    .setName(this.help.name)
    .setDescription(this.help.description);
