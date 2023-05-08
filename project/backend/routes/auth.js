const router = require("express").Router();
const { User, UserType } = require("../models");
const { validationResult } = require("express-validator");
const { isEmail, isPassword, isName } = require("../middlewares/auth-validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/token-verify");
const role = require("../middlewares/role");
const { Op } = require("sequelize");

// Register
router.get("/register", async (req, res) => {
  const roles = await UserType.findAll({
    attributes: ["id", "role"],
  });
  res.status(200);
  res.json({
    roles: roles,
  });
});

// Register
router.post("/register", isEmail, isPassword, isName, async (req, res) => {
  try {
    // Check Validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ message: errors.array() });
    }

    // Check email
    const data = req.body;
    const user = await User.findOne({
      where: { email: data.email },
    });

    if (user !== null) {
      res.status(400);
      return res.json({ message: "Email already exist" });
    }

    // Hashed Password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    data.password = hashedPassword;
    await User.create(data);
    res.status(201);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400);
    res.json({ message: `There is a problem: ${err}` });
  }
});

// Login
router.post("/login", isEmail, isPassword, async (req, res) => {
  try {
    // Check Validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ message: errors.array() });
    }

    // Check email
    const data = req.body;
    const user = await User.findOne({
      where: { email: data.email },
      include: {
        model: UserType,
        attributes: ["role"],
      },
    });

    if (user === null) {
      res.status(400);
      return res.json({ message: "Email or passord not found" });
    }

    if (!(await bcrypt.compare(data.password, user.password))) {
      res.status(400);
      return res.json({ message: "Email or passord not found" });
    }

    const token = generateAccessToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.userType.role,
    });

    res.status(200);
    res.json({ token: token });
  } catch (err) {
    res.status(400);
    res.json({ message: `There is a problem: ${err}` });
  }
});

const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
};

// Get all Users
router.get("/users", verifyToken, role("Admin"), async (req, res) => {
  const search = req.query.search;
  const users = await User.findAll({
    attributes: ["id", "name", "email"],
    where: {
      [Op.or]: [
        {
          "$UserType.role$": {
            [Op.startsWith]: search,
          },
        },
      ],
    },
    include: [
      {
        model: UserType,
        attributes: ["role"],
      },
    ],
  });
  res.status(200);
  res.json(users);
});

// Get specific user
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: { id: id },
    attributes: ["id", "name", "email"],
    include: [
      {
        model: UserType,
        attributes: ["role"],
      },
    ],
  });
  if (user === null) {
    res.status(404);
    res.json({ message: `User not found` });
  } else {
    res.status(200);
    res.json(user);
  }
});

// Delete specific user
router.delete("/users/:id", verifyToken, role("Admin"), async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: { id: id },
  });
  if (user === null) {
    res.status(404);
    res.json({ message: "User not found" });
  } else {
    try {
      await User.destroy({
        where: { id: id },
      });
      res.status(200);
      res.json({ message: "User is deleted" });
    } catch (err) {
      res.status(400);
      res.json({ message: `There is a problem: ${err}` });
    }
  }
});
module.exports = router;
