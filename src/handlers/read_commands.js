const { readdirSync } = require("fs");
const ascii = require("ascii-table");
const table = new ascii("Commands");
table.setHeading("Command", "Load Status");

module.exports = (client) => {
    for (const dir of readdirSync("./src/commands/")) {
        const commands = readdirSync(`./src/commands/${dir}`).filter((f) =>
            f.endsWith(".js")
        );
        for (const file of commands) {
            const props = require(`../commands/${dir}/${file}`);
            if (!props.run || !props.settings || !props.data) {
                table.addRow(file, "✘");
            } else {
                props.help.category = dir;
                const body = props.data;
                client.commands.set(props.help.name, { props, body });
                table.addRow(file, "✔");
            }
        }
    }
    console.log(table.toString());
};
