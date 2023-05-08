module.exports = (db, type) => {
  return db.define("StudentCourse", {
    bid: {
      type: type.INTEGER,
      allowNull: true,
    },
  });
};
