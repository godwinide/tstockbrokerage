const { model, Schema, models } = require("mongoose");

const OtherTransactionSchema = new Schema({
    amount: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    narration: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

module.exports = models.OtherTransaction || model("OtherTransaction", OtherTransactionSchema);