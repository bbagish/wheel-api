var mongoose = require('mongoose');

var tradeSchema = mongoose.Schema({
    type: String,
    strikePrice: Number,
    expirationDate: String,
    premium: Number,
    filledDate: String,
    status: String,
    closingPrice: Number,
    profit: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        userName: String
    }
});

module.exports = mongoose.model('Trade', tradeSchema);