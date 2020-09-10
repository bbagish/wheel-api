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
            ref: "User"
        },
        userName: String
    },
    trades: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trade"
        }
    ]
});

module.exports = mongoose.model("Position", positionSchema);