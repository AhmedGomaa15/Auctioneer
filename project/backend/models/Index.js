const Sequelize = require("sequelize");
const db = require("../config/database");

const CourseModel = require("./Course");
const UserModel = require("./User");
const UserTypeModel = require("./UserType");
const StudentCourseModel = require("./StudentCourse");

const Course = CourseModel(db, Sequelize);
const User = UserModel(db, Sequelize);
const UserType = UserTypeModel(db, Sequelize);
const StudentCourse = StudentCourseModel(db, Sequelize);

User.belongsTo(UserType, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
UserType.hasMany(User);

Course.belongsTo(User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Course);

User.belongsToMany(Course, { through: StudentCourse });
Course.belongsToMany(User, { through: StudentCourse });

db.sync({ force: false }).then(() => {
  console.log("Tables Created");
});

module.exports = {
  Course,
  User,
  UserType,
  StudentCourse,
};
