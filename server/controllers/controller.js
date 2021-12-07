// Controller functions come here
const { User } = require("../model/casaverdeModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { createToken } = require("../JWT-check");
const { sign, verify } = require("jsonwebtoken");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const allControllers = {};

// Add new User
allControllers.addUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await new User({
      _id: mongoose.Types.ObjectId(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      country: req.body.country,
      houseNumber: req.body.houseNumber,
      postalCode: req.body.postalCode,
      verifyAccount: false,
    });
    const token = await sign(
      { email: req.body.email },
      process.env.EMAIL_VERIFY_KEY,
      {
        expiresIn: "20m",
      }
    );

    let testAccount = nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const data = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Bestätigen Sie Ihre E-Mail Adresse",
      html: `<html>
        <h2>Please click on given link to Verify your Account</h2
        <a href="${process.env.CLIENT_URL}/verifyAccount/${token}">Verify your Email</a>
        
      </html>`,
    };
    await transporter.sendMail(data, function (err, success) {
      if (err) {
        return res
          .status(400)
          .json({ error: "Bestätigungs-E-Mail Link Fehler" });
      } else {
        res.status(200).json({
          message:
            "Die Bestätigungs-E-Mail wurde gesendet, checken Sie Ihre E-Mails",
        });
      }
    });
    await user.save();
    res.status(201).json({ message: "Neuer Nutzer wurde angelegt ✅", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// GET all users
allControllers.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(err.message).json({ message: err.message });
  }
};
//resent email confirmation
allControllers.confirmationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    const token = await sign(
      { email: user.email },
      process.env.EMAIL_VERIFY_KEY,
      {
        expiresIn: "20m",
      }
    );

    let testAccount = nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const data = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Verify Your Email",
      html: `<html>
      <h2>Please click on given link to Verify your Account</h2
      <a href="${process.env.CLIENT_URL}/verifyAccount/${token}">Verify your Email</a>
    </html>`,
    };
    await transporter.sendMail(data, function (err, success) {
      if (err) {
        return res.status(400).json({ error: "verify Email link error" });
      } else {
        res.status(200).json({
          message: "Email has been sent ,Check your Email",
        });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// verifyAccount
allControllers.verifyAccount = async (req, res) => {
  const token = req.body.token;
  try {
    if (token) {
      verify(token, process.env.EMAIL_VERIFY_KEY, async (err, decodedToken) => {
        if (err) {
          return res.status(400).json({ error: "Incorrect or Expired Token" });
        }
        const { email } = decodedToken;
        console.log(email);

        await User.findOneAndUpdate(
          { email },
          {
            $set: {
              verifyAccount: true,
            },
          }
        );
        res.status(200).json({ message: "User with this email is verified" });
      });
    } else {
      return res.status(400).json({ error: "something went wrong !!" });
    }
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};

// Login
allControllers.login = async (req, res) => {
  let username = req.body.username;
  let email = req.body.username;
  let password = req.body.password;
  const user =
    (await User.findOne({ username })) || (await User.findOne({ email }));
  if (user == null) {
    return res.status(404).json({ message: "Falscher Benutzername oder E-Mail" });
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      const token = createToken(user);
      await res.status(200).json({
        auth: true,
        token,
        user: {
          username: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      });
    } else {
      res.status(400).json({
        message: "Falsches Passwort, bitte wiederholen!",
      });
    }
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};
// deleteUser
allControllers.deleteUser = async (req, res) => {
  const user = await User.findById(req.id);
  let password = req.headers.pass;
  try {
    if (await bcrypt.compare(password, user.password)) {
      await User.findByIdAndDelete(req.id);
      res.status(200).json({ message: "Der Benutzer wurde gelöscht" });
    } else {
      res.status(400).json({ message: "false Password please repeat !" });
    }
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};
//getOneByID

allControllers.getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    res.json({ auth: "true", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// update userInfos
allControllers.updateUserInfos = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.id, {
      $set: {
        address: req.body.address,
        phone: req.body.phone,
        houseNumber: req.body.houseNumber,
        city: req.body.city,
        country: req.body.country,
        state: req.body.state,
        postalCode: req.body.postalCode,
      },
    });
    res.status(200).json({ message: "Benutzeradresse wurde aktualisiert" });
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};
// change password
allControllers.updatePassword = async (req, res) => {
  let { password, newPassword, passwordConf } = req.body;
  if (newPassword !== passwordConf && newPassword == undefined) {
    return res
      .status(400)
      .json({ message: "Ihr Bestätigungspasswort ist fehlgeschlagen, bitte wiederholen" });
  }
  let _id = req.id;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const user = await User.findById({ _id });
  try {
    if (await bcrypt.compare(password, user.password)) {
      await User.findByIdAndUpdate(req.id, {
        $set: {
          password: hashedPassword,
        },
      });
      res.status(200).json({ message: "Dein Passwort wurde geändert" });
    } else {
      res.status(400).json({
        message: "Nicht erlaubt, bitte überprüfen Sie Ihr Passwort",
      });
    }
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};
// test landing page
allControllers.getDate = async (req, res) => {
  res.status(200).json(req.id);
};

//forget password
allControllers.forgotPassword = async (req, res) => {
  const email = req.body.email;
  User.findOne({ email }, async (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "Benutzer mit dieser E-Mail existiert nicht" });
    }
    const token = sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "20m",
    });
    await user.updateOne({ resetLink: token });
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
      },
    });
    const data = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: `<html>
        <h2>Please click on given link to reset your password</h2
       <a href="${process.env.CLIENT_URL}/resetPassword/${token}">Change your Password</a>
      </html>`,
    };

    await transporter.sendMail(data, function (err, success) {
      if (err) {
        return res.status(400).json({ error: "reset password link error" });
      } else {
        res.status(200).json({
          message: "Eine E-Mail wurde gesendet, überprüfen Sie Ihre E-Mail",
        });
      }
    });
  });
};
//reset password
allControllers.resetPassword = async (req, res) => {
  const { resetLink, newPassword, passwordConf } = req.body;
  if (newPassword !== passwordConf) {
    return res
      .status(401)
      .json({ error: "Falsche Passwortbestätigung bitte wiederholen" });
  }

  if (resetLink) {
    verify(resetLink, process.env.RESET_PASSWORD_KEY, (err, decodedData) => {
      if (err) {
        return res
          .status(401)
          .json({ error: "Incorrect token or it is expired" });
      }
    });
    User.findOne({ resetLink }, async (err, user) => {
      if (err || !user) {
        return res
          .status(400)
          .json({ error: "user with this token does not exist" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const obj = { password: hashedPassword };
      user = _.extend(user, obj);
      user.save();
      res.status(200).json({ message: "Ihr Passwort wurde geändert" });
    });
  } else {
    return res.status(401).json({ error: "Authentication error!!!" });
  }
};
module.exports = allControllers;
