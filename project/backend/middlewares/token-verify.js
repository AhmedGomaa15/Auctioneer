const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(" ")[1];

  if (token == null) {
    res.status(401);
    return res.json({ message: "Invalid Token" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(401);
      return res.json({ message: `Invalid Token: ${err}` });
    }
    
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
