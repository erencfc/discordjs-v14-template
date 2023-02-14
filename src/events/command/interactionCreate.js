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
        if (perm.length > 0) {
            let roleNames = perm.filter(
                (x) => x.charAt(0).toUpperCase() !== x.charAt(0)
            );
            let roles = roleNames.map((name) => client.config.roles[name]);
            let permissions = perm.filter(
                (x) => x.charAt(0).toUpperCase() === x.charAt(0)
            );

            let roles_string = roles.map((r) => `<@&${r}>`).join("\n");
            let permissions_string = permissions
                .map((p) => `\`${p}\``)
                .join("\n");

            if (
                !roles.some((x) =>
                    interaction.member.roles.cache.some((r) => r.id === x)
                ) &&
                permissions &&
                !permissions.some((x) => interaction.member.permissions.has(x))
            )
                return reply(`You need one of the following permissions:

            ${roleNames.length > 0 ? roles_string : ""}
            ${permissions.length > 0 ? permissions_string : ""}`);
        }

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
