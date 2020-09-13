const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const Position = require('../models/position');

router.get("/:id", [auth], (req, res) => {
    //find the position with provided id in DB
    Position.findById(req.params.id, async (err, foundPosition) => {
        if (err || !foundPosition) {
            res.status(404).json({ msg: 'Position is not found' });
        } else {
            res.send(foundPosition);
        }
    });
});

router.get('/', function (req, res) {
    Position.find({}, function (err, allTrades) {
        if (err) {
            res.status(500).send({ msg: 'Something went wrong' })
        } else {
            res.send(allTrades);
        }
    });
});

router.post('/', [auth], async (req, res) => {
    const position = new Position({
        symbol: req.body.symbol,
        price: req.body.price,
        numOfShares: req.body.numOfShares,
        costBasis: req.body.costBasis,
        adjustedCost: req.body.adjustedCost,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    });

    await position.save();

    res.send(position);
});

router.put('/:id', [auth], async (req, res) => {
    Position.findById(req.params.id, async (err, foundPosition) => {

        if (err) {
            return res
                .status(404)
                .send({ msg: 'The position with the given ID was not found.' });
        }

        if (!foundPosition.author.id.equals(req.user._id)) {
            return res
                .status(403)
                .send({ msg: "You don't have permission to do that." });
        }

        const { price, numOfShares } = req.body;

        foundPosition.price = price;
        foundPosition.numOfShares = numOfShares;
        const costBasis = numOfShares * price;
        foundPosition.costBasis = costBasis;
        const profit = typeof foundPosition.profit === 'undefined' ? 0 : foundPosition.profit;
        foundPosition.adjustedCost = costBasis - profit;

        await foundPosition.save();
        res.send(foundPosition);
    });
});
//TODO: BETTER ERROR HANDLING HERE
//DELETE ALL TRADES AFTER DELETING THE POSITION
router.delete("/:id", [auth], async (req, res) => {
    const position = await Position.findByIdAndRemove(req.params.id);
    res.send(position);
});

module.exports = router;
