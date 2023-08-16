import express from "express";
import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getToken } from "../utils/getToken.js";

const router = express.Router();

// Add member
router.post("/", (req, res) => {
  const token = getToken(req, res);

  if (!token) {
    return res.status(500).json("Not authenticated. Authorization denied!");
  }

  jwt.verify(token, process.env.JWT, (err, userInfo) => {
    if (err) return res.status(500).json(err);

    if (userInfo) {
      const q = "SELECT * FROM `users` WHERE username=?";

      db.query(q, [req.body.username], (err, user) => {
        if (err) return res.status(500).json(err);

        if (user.length) {
          return res
            .status(400)
            .json(
              `A user with username: ${user[0].username} already exists in the database.`
            );
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        // const token = jwt.sign(
        //   { username: req.body.username, password: req.body.password },
        //   process.env.JWT
        // );
        const link =
          "http://localhost:3000?redirect_url=https://ll04-finance-dowell.github.io/workflowai.online";
        const q =
          "INSERT INTO users(`username`,`password`,`organization`,`portfolio`,`product`,`link`,`isAdmin`,`uxLivingLabAdminId`) VALUES (?)";

        const values = [
          req.body.username,
          hash,
          req.body.organization,
          req.body.portfolio,
          req.body.product,
          link,
          req.body.isAdmin,
          req.body.uxLivingLabAdminId,
        ];

        if (
          !req.body.username ||
          !hash ||
          !req.body.organization ||
          !req.body.portfolio ||
          !req.body.product ||
          !req.body.uxLivingLabAdminId
        )
          return res.status(400).json("All inputs are required!");

        db.query(q, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          res.status(200).json("Account created.");
        });
      });
    }
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

    const token = jwt.sign({ id: others.id }, process.env.JWT);

    res.status(200).json({ user: others, token });
  });
});

// Get workspace users
router.get("/org/:uxLivingLabAdminId", (req, res) => {
  const token = getToken(req, res);

  if (!token) {
    return res.status(500).json("Not authenticated. Authorization denied!");
  }

  jwt.verify(token, process.env.JWT, (err, userInfo) => {
    if (err) return res.status(500).json(err);

    if (userInfo) {
      const q = "SELECT * FROM `users` WHERE uxLivingLabAdminId=?";

      db.query(q, [req.params.uxLivingLabAdminId], (err, users) => {
        if (err) return res.status(500).json(err);

        if (users.length > 0) {
          return res.status(200).json(users);
        }
      });
    }
  });
});

// Get loggedin user
router.get("/:username", (req, res) => {
  const token = getToken(req, res);

  if (!token) {
    return res.status(500).json("Not authenticated. Authorization denied!");
  }

  jwt.verify(token, process.env.JWT, (err, userInfo) => {
    if (err) return res.status(500).json(err);

    if (userInfo) {
      const q = "SELECT * FROM `users` WHERE username=?";

      db.query(q, [req.params.username], (err, user) => {
        if (err) return res.status(500).json(err);

        if (user.length > 0) {
          return res.status(200).json(user[0]);
        }
      });
    }
  });
});

// Delete user
router.delete("/:id", (req, res) => {
  const token = getToken(req, res);

  if (!token) {
    return res.status(500).json("Not authenticated. Authorization denied!");
  }

  jwt.verify(token, process.env.JWT, (err, userInfo) => {
    if (err) return res.status(500).json(err);

    if (userInfo) {
      const userQuery = "SELECT * FROM `users` WHERE id=?";

      db.query(userQuery, [userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);

        if (data[0].isAdmin) {
          const q = "DELETE FROM `users` WHERE id=?";

          db.query(q, [req.params.id], (err, user) => {
            if (err) return res.status(500).json(err);

            res.status(200).json("User deleted!");
          });
        }
      });
    }
  });
});

export default router;
