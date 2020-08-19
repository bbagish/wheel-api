var mongoose = require("mongoose");

var positionSchema = new mongoose.Schema({
    symbol: String,
    price: Number,
    numOfShares: Number,
    trades: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trade"
        }
    ]
});

module.exports = mongoose.model("Position", positionSchema);