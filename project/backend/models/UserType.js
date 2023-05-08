module.exports = (db, type) => {
    return db.define("userType", {
      id: {
        type: type.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role: {
        type: type.STRING,
        allowNull: false,
      },
    });
  };
  