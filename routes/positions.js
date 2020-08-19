var express = require('express');
var router = express.Router();
var Position = require('../models/position');

router.get('/', function (req, res, next) {
    Position.find({}, function (err, allTrades) {
        if (err) {
            console.log(err);
        } else {
            res.send(allTrades);
        }
    });
});

router.post("/", async (req, res) => {
    const position = new Position({
        symbol: req.body.symbol,
        price: req.body.price,
        numOfShares: req.body.numOfShares
    });
    await position.save();
    res.send(position);
});

router.get("/:id", (req, res) => {
    //find the campground with provided id in DB
    Position.findById(req.params.id).populate("trades").exec((err, foundPosition) => {
      if (err || !foundPosition) {
        console.log("Position is not found");
        res.redirect("back");
      } else {
        res.send(foundPosition);
      }
    });
  });

// router.get("/:id", async (req, res) => {
//     const position = await Position.findById(req.params.id).select("-__v");
//     if (!position) {
//         return res
//             .status(400)
//             .send("The campground with the given ID was not found.");
//     }
//     res.send(position);
// });

router.put("/:id", async (req, res) => {
    const position = await Position.findByIdAndUpdate(
        req.params.id,
        {
            symbol: req.body.symbol,
            price: req.body.price,
            numOfShares: req.body.numOfShares
        },
        { new: true }
    );
    if (!position) {
        return res
            .status(404)
            .send("The position with the given ID was not found.");
    }
    res.send(position);
});

router.delete("/:id", async (req, res) => {
    const position = await Position.findByIdAndRemove(req.params.id);

    if (!position) {
        return res
            .status(404)
            .send("The position with the given ID was not found.");
    }
    res.send(position);
});

module.exports = router;
