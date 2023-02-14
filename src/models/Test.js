const { Schema, model } = require("mongoose");
const client = require("../client");

const TestSchema = new Schema({
    testString: String,
});

TestSchema.post("init", function (doc) {
    console.log("%s has been initialized from the db", doc._id);
    console.log(client.user.username);
});

module.exports = model("Test", TestSchema);
