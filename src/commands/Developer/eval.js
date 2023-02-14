const Discord = require("discord.js");

/**
 * @param {Discord.Client} client
 * @param {Discord.Interaction} interaction
 */

exports.run = async function (client, interaction) {
    let embed = new Discord.EmbedBuilder()
        .setAuthor({
            name: interaction.member.displayName,
            iconURL: interaction.member.displayAvatarURL(),
        })
        .setColor("#f48924");

    let code = interaction.options.get("code").value;

    if (code.includes("token"))
        return await interaction.reply({
            embeds: [
                embed.setDescription(
                    "**You can't use the token in the eval command!**"
                ),
            ],
        });

    if (code.includes("members.cache")) await interaction.guild.members.fetch();
    if (code.includes("channels.cache"))
        await interaction.guild.channels.fetch();
    if (code.includes("roles.cache")) await interaction.guild.roles.fetch();
    if (code.includes("client.users.cache")) await client.users.fetch();

    function clean(text) {
        if (typeof text !== "string")
            text = require("util").inspect(text, { depth: 0 });
        text = text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
        return text;
    }

    try {
        var evaled = clean(await eval(code)).replace(
            /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g,
            "-TOKEN-"
        );

        if (evaled.length > 2000) {
            let attach = new Discord.AttachmentBuilder(
                Buffer.from(
                    `I am sending the output as a file because the output is too long.\n\nInput: ${code}\nOutput: ${evaled.replace(
                        /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g,
                        "-TOKEN-"
                    )}`,
                    "utf-8"
                ),
                "eval.js"
            );

            return await interaction.reply({ files: [attach] });
        } else {
            return await interaction.reply({
                embeds: [
                    embed.setDescription(
                        `**Input:** \`\`\`js\n${code}\`\`\`\n**Output:** \`\`\`js\n${evaled.replace(
                            /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g,
                            "-TOKEN-"
                        )}\`\`\``
                    ),
                ],
            });
        }
    } catch (err) {
        return await interaction.reply({
            embeds: [
                embed
                    .setDescription(`**Error:** \`\`\`js\n${err}\`\`\``)
                    .setColor("Red"),
            ],
        });
    }
};

exports.settings = {
    enabled: true,
    onlyOwner: true,
    perm: "",
};

exports.help = {
    name: "eval",
    description: "Evaluates a code.",
    category: __dirname.slice(__dirname.lastIndexOf("\\") + 1),
};

exports.data = new Discord.SlashCommandBuilder()
    .setName(this.help.name)
    .setDescription(this.help.description)
    .addStringOption((option) =>
        option
            .setName("code")
            .setDescription("The code to evaluate.")
            .setRequired(true)
    );
