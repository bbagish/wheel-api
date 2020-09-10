var express = require('express');
var router = express.Router();
const auth = require("../middleware/auth");
var Position = require('../models/position');
var Trade = require('../models/trade');

router.get("/:id", [auth], (req, res) => {
    //find the position with provided id in DB
    Position.findById(req.params.id).populate("trades").exec((err, foundPosition) => {
        if (err || !foundPosition) {
            res.status(404).json({ msg: 'Position is not found' })
        } else {
            res.send(foundPosition);
        }
    });
});

router.get('/', function (req, res) {
    Position.find({}, function (err, allTrades) {
        if (err) {
            console.log(err);
        } else {
            res.send(allTrades);
        }
    });
});

router.post("/", [auth], async (req, res) => {
    const position = new Position({
        symbol: req.body.symbol,
        price: req.body.price,
        numOfShares: req.body.numOfShares,
        costBasis: req.body.costBasis,
        adjustedCost: req.body.adjustedCost,
        author: {
            id: req.user._id,
            userName: req.user.userName
        }
    });
    await position.save();
    res.send(position);
});

router.put("/:id", [auth], async (req, res) => {
    const position = await Position.findById(req.params.id, async (err, foundPosition) => {
        if (err) {
            return res
                .status(404)
                .send("The position with the given ID was not found.");
        } else {
            if (foundPosition.author.id.equals(req.user._id)) {
                console.log("EXPECTED:", foundPosition.author.id);
                console.log("ACTUAL: ", req.user._id);

                foundPosition.price = req.body.price;
                foundPosition.numOfShares = req.body.numOfShares;
                const costBasis = req.body.numOfShares * req.body.price;
                foundPosition.costBasis = costBasis;
                const profit = typeof foundPosition.profit === "undefined" ? 0 : foundPosition.profit;
                foundPosition.adjustedCost = costBasis - profit;
                
                await foundPosition.save();
            } else {
                return res
                    .status(401)
                    .send("You don't have permission to do that");
            }
        }
    });

    // const position = await Position.findByIdAndUpdate(
    //     req.params.id,
    //     {
    //         symbol: req.body.symbol,
    //         price: req.body.price,
    //         numOfShares: req.body.numOfShares,
    //         costBasis: req.body.numOfShares * req.body.price,
    //         author: {
    //             id: req.user._id,
    //             userName: req.user.userName
    //         }
    //     },
    //     { new: true }
    // );
    // if (!position) {
    //     return res
    //         .status(404)
    //         .send("The position with the given ID was not found.");
    // }
    res.send(position);
});

router.delete("/:id", [auth], async (req, res) => {
    const position = await Position.findByIdAndRemove(req.params.id);
    res.send(position);
});

module.exports = router;
