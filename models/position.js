var mongoose = require("mongoose");

var positionSchema = new mongoose.Schema({
    symbol: String,
    price: Number,
    numOfShares: Number,
    costBasis: Number,
    adjustedCost: Number,
    profit: Number,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String
    },
    trades: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trade",
            autopopulate: true
        }
    ]
});

positionSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model("Position", positionSchema);