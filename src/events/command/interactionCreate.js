const Discord = require("discord.js");
const cooldown_control = require("../../utils/cooldown_control");

const embed = new Discord.EmbedBuilder().setColor("Red");

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    let cmdName = interaction.commandName;
    let cmd;

    client.commands.has(cmdName) && (cmd = client.commands.get(cmdName));

    if (!cmd) return;

    let settings = cmd.props.settings;
    let perm = settings.perm;

    if (interaction.user.id != client.config.ownerID) {
        let reply = async (message) =>
            await interaction.reply({
                embeds: [embed.setDescription(`**${message}**`)],
                ephemeral: true,
            });
        // Command Status Control
        if (!settings.enabled)
            return reply("This command is currently disabled.");

        // Only Owner Control
        if (settings.onlyOwner)
            return reply("This command is available only to the bot owner.");

        // Permission Control
        if (perm && !interaction.memberPermissions.has(perm))
            return reply(
                `You need \`${perm}\` permission to use this command.`
            );

        // Cooldown Control
        if (
            settings.cooldown > 0 &&
            (await cooldown_control(client, interaction, settings.cooldown))
        )
            return;
    }

    try {
        await cmd.props.run(client, interaction);
    } catch (error) {
        console.error(error);
        let reply = {
            content: "An error occurred while executing this command.",
            ephemeral: true,
        };

        if (interaction.deferred || interaction.replied)
            return await interaction.editReply(reply);
        await interaction.reply(reply);
    }
};
