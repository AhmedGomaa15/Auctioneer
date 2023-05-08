const role = (role) => {
  return (req, res, next) => {
    const user = req.user;
    if (user.role != role) {
      res.status(401);
      return res.json({ message: "Invalid Role" });
    }
    next();
  };
};
module.exports = role;
