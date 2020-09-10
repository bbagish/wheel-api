var middlewareObj = {};
var Position = require("../models/position");
var Trade = require("../models/trade");

middlewareObj.checkTradeOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Trade.findById(req.params.trade_id, function (err, foundTrade) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundTrade.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log("You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        console.log("You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkPositionOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Position.findById(req.params.id, function (err, foundPosition) {
            if (err) {
                console.log("Position not found");
                res.redirect("back");
            } else {
                if (foundPosition.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log("You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        console.log("You need to be logged in to do that");
        res.redirect("back");
    }
};

module.exports = middlewareObj;