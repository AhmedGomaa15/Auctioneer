module.exports = (db, type) => {
  return db.define("user", {
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    email: {
      type: type.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: type.STRING,
      allowNull: false,
    },
    statue: {
      type: type.STRING,
      allowNull: true,
    },
  });
};
