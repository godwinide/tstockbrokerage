const { model, Schema, models } = require("mongoose");

const SiteSchema = new Schema({
    bitcoin: {
        type: String,
        required: false
    },
    tether: {
        type: String,
        required: false
    },
    ethereum: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = models.Site || model("Site", SiteSchema);