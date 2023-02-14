const { readdirSync } = require("fs");
const ascii = require("ascii-table");
const table = new ascii("Events");
table.setHeading("Event", "Load Status");

module.exports = (client) => {
    for (const dir of readdirSync("./src/events/")) {
        const events = readdirSync(`./src/events/${dir}`).filter((f) =>
            f.endsWith(".js")
        );
        for (const file of events) {
            const event = require(`../events/${dir}/${file}`);
            const eventName = file.split(".")[0];
            if (typeof event == "function") {
                table.addRow(eventName, "✔");
                client.on(eventName, event.bind(null, client));
            } else table.addRow(eventName, "✘");
        }
    }

    console.log(table.toString());
};
