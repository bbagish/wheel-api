var mongoose = require("mongoose");

var tradeSchema = mongoose.Schema({
    type: String,
    strikePrice: Number,
    expirationDate: String,
    premium: Number,
    filledDate: Strin[хззззжg,
    status: String
});

module.exports = mongoose.model("Trade", tradeSchema);