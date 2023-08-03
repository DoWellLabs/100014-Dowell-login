import express from "express";
import { db } from "../config/db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Add member
router.post("/", (req, res) => {
  const q = "SELECT * FROM `users` WHERE username=?";

  db.query(q, [req.body.username], (err, user) => {
    if (err) return res.status(500).json(err);

    if (user.length) {
      return res
        .status(400)
        .json(`A user with username:${user[0].username} already created.`);
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users(`username`,`password`,`organization`,`portfolio`,`product`,`link`,`isAdmin`) VALUES (?)";

    const values = [
      req.body.username,
      hash,
      req.body.organization,
      req.body.portfolio,
      req.body.product,
      req.body.link,
      req.body.isAdmin,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      res.json("Account created.");
    });
  });
});

// Login
router.post("/login", (req, res) => {
  const q = "SELECT * FROM `users` WHERE username=?";

  db.query(q, [req.body.username], (err, user) => {
    if (err) return res.status(500).json(err);

    if (user.length === 0) {
      return res.status(409).json("Invalid username or password!");
    }

    const isMatch = bcrypt.compareSync(req.body.password, user[0].password);

    if (!isMatch) return res.status(400).json("Invalid username or password!");

    // const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET);

    const { password, ...others } = user[0];

    res.status(200).json(others);
  });
});

// Get public users
router.get("/", (req, res) => {
  const q = "SELECT * FROM `users`";

  db.query(q, (err, users) => {
    if (err) return res.status(500).json(err);

    if (users.length > 0) {
      return res.status(200).json(users);
    }
  });
});

// Get loggedin user
router.get("/:username", (req, res) => {
  const q = "SELECT * FROM `users` WHERE username=?";

  db.query(q, [req.params.username], (err, user) => {
    if (err) return res.status(500).json(err);

    if (user.length > 0) {
      return res.status(200).json(user[0]);
    }
  });
});

export default router;
