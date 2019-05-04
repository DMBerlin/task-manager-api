const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middleware/auth");
const sharp = require("sharp");
const { sendWelcomeEmail, sendFarewellEmail } = require("../emails/account");
const { sendEmail } = require("../emails/nodemailer");

/**
 * CREATE NEW USER
 */
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    // sendWelcomeEmail(user.email, user.name);
    sendEmail("danmg22@gmail.com", "Welcome to our service, " + user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * LOGIN IN
 */
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * LOGIN OUT
 */
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

/**
 * LOGIN OUT FROM ALL DEVICES
 */
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    //Keep last session alive
    //req.user.tokens = req.user.tokens.filter((token) => token.token === req.token);
    //Wipe all sessions
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

/**
 * READ MY PROFILE USING A VALID TOKEN
 */
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

/**
 * GET USER BY ID
 */
// router.get('/users/:id', async (req, res) => {
// 	const _id = req.params.id;
// 	try {
// 		const user = await User.findById(_id);
// 		if (!user) {
// 			return res.status(404).send();
// 		}
// 		res.send(user);
// 	} catch (e) {
// 		res.status(500).send(e);
// 	}
// });

/**
 * UPDATE USER PROFILE
 */
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid params on update." });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * DELETE USER BY ID
 */
router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    // 	return res.status(404).send();
    // }

    await req.user.remove();
    sendFarewellEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

/**
 * Upload AVATAR IMAGE file
 */
const multer = require("multer");
const upload = multer({
  limits: {
    fileSize: 1000000
    //number in bytes (1.0MB)
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File must be jpg, jpeg or png"));
    }

    cb(undefined, true);
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

/**
 * Delete AVATAR IMAGE from User Profile
 */
router.delete("/users/me/avatar", auth, async (req, res) => {
  if (!req.user.avatar) {
    return res.status(404).send();
  }
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

/**
 * File Exports
 */
module.exports = router;
