const router = require("express").Router();
const { Course, User,UserType } = require("../models");
const { isCourse } = require("../middlewares/auth-validation");
const upload = require("../middlewares/upload");
const role = require("../middlewares/role");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// get all courses
router.get("/courses", async (req, res) => {
 const search = req.query.search;
 console.log(search);
  const courses = await Course.findAll({
   where: {
      [Op.or]: [
        {
          "$Course.courseName$": {
            [Op.startsWith]: search
          },
        },
      ],
    },
    include: {
      model: User,
      attributes: ["name"],
    },
  });

  courses.map( (course)=>{
    course.courseImage = `http://localhost:4000/${course.courseImage}`;
  });

  res.status(200);
  res.json(courses);
});

// post new course
router.post("", role("Seller"), upload.single("image"), isCourse, async (req, res) => {
  const data = req.body;

  try {
    // Check Validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ message: errors.array() });
    }

    if (!req.file) {
      data.courseImage = "course-default.jpg";
    } else {
      data.courseImage = req.file.filename;
    }

    // Get logged in user userId (Professor Id) from request (revise token-verify.js => line 18 => "middlewares" folder)
    // Instead of sending userId (Professor Id) from the front-end
    
    //data.userId = req.user.id;
    const course = await Course.create(data);
    res.status(201);
    res.json({ message: `Course is created. Course id: ${course.id}` });
  } catch (err) {
    res.status(400);
    res.json({ message: `There is a problem: ${err}` });
  }
});

// Get specific course
router.get("/course/:id", async (req, res) => {
  const { id } = req.params;
  const FindCourse = await Course.findOne({
    where: { id: id },
    attributes: ["courseName", "description", "price"],
  });

  if (FindCourse === null) {
    res.status(404);
    res.json({ message: "Course not found" });
  } else {
    res.status(200);
    res.json(FindCourse);
  }
});

// Update specific course
router.put("/updateCourse/:id", async (req, res) => {
  const { id } = req.params;
  const UpdateCourse = await Course.findOne({
    where: { id: id },
  });

  if (UpdateCourse === null) {
    res.status(404);
    res.json({ message: "Course not found" });
  } else {
    const data = req.body;
    try {
      await Course.update(
        {
          price: data.price,
        },
        {
          where: { id: id },
        }
      );
      res.status(200);
      res.json({ message: "Course is Updated" });
    } catch (err) {
      res.status(400);
      res.json({ message: `There is a problem: ${err}` });
    }
  }
});

module.exports = router;
