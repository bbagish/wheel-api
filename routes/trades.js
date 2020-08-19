var express = require('express');
var router = express.Router({ mergeParams: true }),

var Position = require('../models/position');
var Trade = require('../models/trade');

router.post("/", function (req, res) {
    Position.findById(req.params.id, function (err, position) {
        if (err) {
            console.log(err);
            res.redirect("/positions");
        } else {
            Trade.create(req.body.trade, function (err, trade) {
                if (err) {
                    console.log('Something went wrong');
                } else {
                    trade.strikePrice = req.body.strikePrice;
                    trade.type = req.body.type;
                    trade.expirationDate = req.body.expirationDate;
                    trade.premium = req.body.premium;
                    trade.filledDate = req.body.filledDate;

                    trade.save();
                    position.trades.push(trade);
                    position.save();
                    console.log("Successfully added a trade");
                }
            });
        }
    });
});

router.put("/:comment_id", function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:trade_id", function (req, res) {
    Trade.findByIdAndRemove(req.params.trade_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            console.log("Trade deleted");
            res.redirect("/trades/" + req.params.id);
        }
    });
});

// router.get("/new", function (req, res) {
//     Position.findById(req.params.id, function (err, position) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.render("comments/new", { position: position });
//         }
//     });
// });


module.exports = router;
