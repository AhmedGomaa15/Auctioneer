const router = require("express").Router();
const { UserType } = require("../models");

// Get all roles
router.get("", async (req, res) => {
  const roles = await UserType.findAll({
    attributes: ["id", "role"],
  });
  res.status(200);
  res.json(roles);
});

// add new role
router.post("", async (req, res) => {
  const data = req.body;
  try {
    const role = await UserType.create(data);
    res.status(201);
    res.json({
      message: `New role is created. Role id: ${role.id}`,
    });
  } catch (err) {
    res.status(400);
    res.json({ message: `There is a problem: ${err}` });
  }
});

// Get specific role
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const role = await UserType.findOne({
    where: { id: id },
    attributes: ["role"],
  });

  if (role === null) {
    res.status(404);
    res.json({ message: "Role not found" });
  } else {
    res.status(200);
    res.json(role);
  }
});

// Update specific role
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const role = await UserType.findOne({
    where: { id: id },
    
  });

  if (role === null) {
    res.status(404);
    res.json({ message: "Role not found" });
  } else {
    const data = req.body;
    try {
      await UserType.update(
        {
          role: data.role,
        },
        {
          where: { id: id },
        }
      );
      res.status(200);
      res.json({ message: "Role is Updated" });
    } catch (err) {
      res.status(400);
      res.json({ message: `There is a problem: ${err}` });
    }
  }
});

// Delete specific role
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const role = await UserType.findOne({
    where: { id: id },
  });

  if (role === null) {
    res.status(404);
    res.json({ message: "Role not found" });
  } else {
    try {
      await UserType.destroy({
        where: { id: id },
      });
      res.status(200);
      res.json({ message: "Role is deleted" });
    } catch (err) {
      res.status(400);
      res.json({ message: `There is a problem: ${err}` });
    }
  }
});
module.exports = router;
