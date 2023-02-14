const client = require("./client");
const { readdirSync } = require("fs");
const { set, connect } = require("mongoose");
require("dotenv").config();

// Load all handlers and models
["handlers", "models"].forEach((name) => {
    readdirSync(`./src/${name}`).map((file) =>
        require(`./${name}/${file.split(".")[0]}`)(client)
    );
});

// Connect to MongoDB
(async function () {
    set("strictQuery", true);
    await connect(process.env.MONGO_URI).then(() =>
        console.log("MongoDB Connected.")
    );
})();

client.login(process.env.TOKEN);
