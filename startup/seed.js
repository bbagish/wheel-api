var Position = require("../models/position");
var Trade = require("../models/trade");

var data = [
    // {
    //     symbol: "MSFT",
    //     price: 205,
    //     numOfShares: 200
    // },
    // {
    //     symbol: "NKLA",
    //     price: 45,
    //     numOfShares: 300
    // },
    {
        symbol: "JETS",
        price: 17.3,
        numOfShares: 100
    },
];

function seedDB() {
    //Remove all Positions
    Position.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed Positions!");
        Trade.remove({}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("removed Trades!");
            //add a few Positions
            data.forEach(function (seed) {
                Position.create(seed, function (err, position) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added a Position");
                        //create a Trade
                        Trade.create(
                            {
                                type: "Call",
                                strikePrice: 17.5,
                                expirationDate: '08/21',
                                premium: 0.45,
                                filledDate: "08/14",
                                status: 'In Progress'
                            },
                            function (err, trade) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    position.trades.push(trade);
                                    position.save();
                                    console.log("Created new Trade");
                                }
                            }
                        );
                    }
                });
            });
        });
    });
    //add a few Trades
}

module.exports = seedDB;