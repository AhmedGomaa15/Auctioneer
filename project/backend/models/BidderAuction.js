module.exports = (db, type) => {
  return db.define("BidderAuction", {
    bid: {
      type: type.INTEGER,
      allowNull: true,
    },
  });
};
