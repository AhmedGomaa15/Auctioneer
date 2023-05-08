module.exports = (db, type) => {
  return db.define("Course", {
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    courseName: {
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
    courseImage: {
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
