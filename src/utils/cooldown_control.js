const Discord = require("discord.js");

module.exports = async (client, interaction, ms) => {
    let cooldowns = client.cooldowns;
    let cmdName = interaction.commandName;

    if (!cooldowns.has(cmdName))
        cooldowns.set(cmdName, new Discord.Collection());

    let now = Date.now();
    let timestamps = cooldowns.get(cmdName);
    let cooldownAmount = ms;

    if (timestamps.has(interaction.user.id)) {
        let expirationTime =
            timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            let timeLeft = Math.floor(expirationTime / 1000);
            await interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `**Slow down! Try to use this command again <t:${timeLeft}:R>**`
                        ),
                ],
            });

            setTimeout(
                () => interaction.deleteReply().catch(() => {}),
                expirationTime - now - 1000
            );

            return true;
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    return false;
};
