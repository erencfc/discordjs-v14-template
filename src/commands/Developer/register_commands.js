const Discord = require("discord.js");
const register_commands = require("../../utils/register_commands");

/**
 * @param {Discord.Client} client
 * @param {Discord.Interaction} interaction
 */

exports.run = async function (client, interaction) {
    await interaction.deferReply();
    await register_commands(interaction.guild);
    interaction.editReply(`**Registered!**`);
};

exports.settings = {
    enabled: true,
    onlyOwner: true,
    perm: [],
};

exports.help = {
    name: "register_commands",
    description: "Register slash commands.",
};

exports.data = new Discord.SlashCommandBuilder()
    .setDefaultMemberPermissions(0)
    .setName(this.help.name)
    .setDescription(this.help.description);
