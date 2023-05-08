const router = require("express").Router();
const { Auction, User,UserType } = require("../models");
const { isAuction } = require("../middlewares/auth-validation");
const upload = require("../middlewares/upload");
const role = require("../middlewares/role");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// get all auction
router.get("/auctions", async (req, res) => {
 const search = req.query.search;
 console.log(search);
  const auctions = await Auction.findAll({
   where: {
      [Op.or]: [
        {
          "$Auction.auctionName$": {
            [Op.startsWith]: search
          },
        },
      ],
    },
    include: {
      model: User,
      attributes: ["name"],
    },
  });

  auctions.map( (auction)=>{
    auction.auctionImage = `http://localhost:4000/${auction.auctionImage}`;
  });

  res.status(200);
  res.json(auctions);
});

// post new auction
router.post("", role("Seller"), upload.single("image"), isAuction, async (req, res) => {
  const data = req.body;

  try {
    // Check Validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ message: errors.array() });
    }

    if (!req.file) {
      data.auctionImage = "auction-default.jpg";
    } else {
      data.auctionImage = req.file.filename;
    }

    // Get logged in user userId (Professor Id) from request (revise token-verify.js => line 18 => "middlewares" folder)
    // Instead of sending userId (Professor Id) from the front-end
    
    //data.userId = req.user.id;
    const auction = await Auction.create(data);
    res.status(201);
    res.json({ message: `Auction is created. Auction id: ${auction.id}` });
  } catch (err) {
    res.status(400);
    res.json({ message: `There is a problem: ${err}` });
  }
});

// Get specific auction
router.get("/auction/:id", async (req, res) => {
  const { id } = req.params;
  const FindAuction = await Auction.findOne({
    where: { id: id },
    attributes: ["auctionName", "description", "price"],
  });

  if (FindAuction === null) {
    res.status(404);
    res.json({ message: "Auction not found" });
  } else {
    res.status(200);
    res.json(FindAuction);
  }
});

// Update specific auction
router.put("/updateAuction/:id", async (req, res) => {
  const { id } = req.params;
  const UpdateAuction = await Auction.findOne({
    where: { id: id },
  });

  if (UpdateAuction === null) {
    res.status(404);
    res.json({ message: "Auction not found" });
  } else {
    const data = req.body;
    try {
      await Auction.update(
        {
          price: data.price,
        },
        {
          where: { id: id },
        }
      );
      res.status(200);
      res.json({ message: "Auction is Updated" });
    } catch (err) {
      res.status(400);
      res.json({ message: `There is a problem: ${err}` });
    }
  }
});

module.exports = router;
