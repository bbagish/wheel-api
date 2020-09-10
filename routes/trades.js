var express = require('express');
var router = express.Router({ mergeParams: true });
const auth = require("../middleware/auth");

var Position = require('../models/position');
var Trade = require('../models/trade');

router.post("/", [auth], async (req, res) => {
    const trade = new Trade(req.body);
    await trade.save();
    await Position.findById(req.params.id, async (err, position) => {
        if(err) {
            return res.status(404).send({message: 'Position is not found'});
        } else {
            position.trades.push(trade);
            await position.save();
        }
    });
    res.send(trade);
});

// TODO FIX THIS ROUTE
router.put("/:trade_id", [auth], async (req, res) => {
    const trade = await Trade.findByIdAndUpdate(
        req.params.trade_id,
        {
            type: req.body.type,
            strikePrice: req.body.strikePrice,
            expirationDate: req.body.expirationDate,
            premium: req.body.premium,
            filledDate: req.body.filledDate,
            closingPrice: req.body.closingPrice,
            status: req.body.status,
        },
        { new: true }
    );
    if (!trade) {
        return res
            .status(404)
            .send("The trade with the given ID was not found.");
    }
    res.send(trade);
});

router.put("/:trade_id/close", [auth], async (req, res) => {
    const trade = await Trade.findByIdAndUpdate(
        req.params.trade_id,
        {
            type: req.body.type,
            strikePrice: req.body.strikePrice,
            expirationDate: req.body.expirationDate,
            premium: req.body.premium,
            filledDate: req.body.filledDate,
            closingPrice: req.body.closingPrice,
            status: req.body.status,
            profit: (req.body.premium - req.body.closingPrice).toFixed(2)
        },
        { new: true }
    );

    if (!trade) {
        return res
            .status(404)
            .send("The trade with the given ID was not found.");
    }

    await Position.findById(req.params.id).populate("trades").exec(async (err, foundPosition) => {
        if (err || !foundPosition) {
            res.status(404).json({ msg: 'Position is not found' })
        } else {

            var arr = [];
            foundPosition.trades.forEach(trade => arr.push(trade.profit));

            var sum = arr.reduce(function (a, b) {
                return a + b;
            }, 0);

            //console.log(sum);
            foundPosition.profit = sum;
            foundPosition.adjustedCost = foundPosition.costBasis - sum;
            await foundPosition.save();
            res.send(foundPosition);
        }
    });

});

router.delete("/:trade_id", [auth], async (req, res) => {

    const trade = await Trade.findByIdAndRemove(req.params.trade_id);
    if (!trade) {
        return res.status(404).send("The trade with the given ID was not found.");
    }
    // DELETING REFERENCE OF THE TRADE
    await Position.findById(req.params.id).populate("trades").exec(async (err, position)=> {
        if(err) {
            return res.status(404).send({message: 'Position is not found'});
        } else {
            position.trades.pull({ _id: req.params.trade_id })

            var arr = [];
            position.trades.forEach(trade => {
                return arr.push(trade.profit);
            });
            var sum = arr.reduce(function (a, b) {
                return a + b;
            }, 0);
            position.adjustedCost = position.costBasis - sum;
            position.profit = sum;
            await position.save();

            res.send(position);
        }
    });


});

module.exports = router;
