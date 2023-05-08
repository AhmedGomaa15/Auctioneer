module.exports = (db, type) => {
  return db.define("Auction", {
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    auctionName: {
      type: type.STRING,
      allowNull: false,
    },
    description: {
      type: type.STRING,
      allowNull: false,
    },
    price: {
      type: type.INTEGER,
      allowNull: false,
    },
    auctionImage: {
      type: type.STRING,
      allowNull: false,
    },
    startDate:{
      type: type.DATE,
      allowNull: false
    },
   endDate:{
      type: type.DATE,
      allowNull: false
  }
  });
};
