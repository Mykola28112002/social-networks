const { User } = require("../Validations/userShema");
const { Conflict, Unauthorized } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const fs = require('fs/promises');
const path = require('path');
const gravatar = require('gravatar');
const Jimp = require('jimp');

async function register(req, res, next) {
  const { email, password } = req.body;
  const bcryptPassword = await bcrypt.hash(password, 10)
  const avatar = gravatar.url(email,{s: '250'});
  const user = new User({ email, password:bcryptPassword, avatarURL: avatar});
  try {
    await user.save();
  } catch (error) {
    if (error.message.includes("duplicate key error collection")) {
      throw new Conflict("User with this email already registered");
    }

    throw error;
  }

  return res.status(201).json({
    data: {
      user: {
        _id: user._id,
      },
    },
  });
}

async function login(req, res, next) {

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized("User does not exists");
  }
  const isPasswordTheSame = await bcrypt.compare(password, user.password);
  if (!isPasswordTheSame) {
    throw new Unauthorized("wrong password");
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET);

  user.token = token;
  await User.findByIdAndUpdate(user._id, user);

  return res.json({
    data: {
      token,
    },
  });
}

async function logout(req, res, next) {
  const { user } = req;
  user.token = null;
  const result = await User.findByIdAndUpdate(user._id, user);
   
  if (!result) {
    throw new Unauthorized("Not found");
  }
  return res.json({});
}

async function current(req, res, next) {
  const { user } = req;
  const currentUser = await User.findById(user._id,{email: 1, subscription: 1, _id: 0});
  if (!currentUser) {
    throw new Unauthorized("Not found");
  }
  return res.json({currentUser});
}

async function avatars(req, res, next) {
  const { user } = req;
  const newPath = path.join("public/avatars", req.file.filename)
  await fs.rename(req.file.path, newPath)

  const avatars = await Jimp.read(newPath, (err, image) => {
  if (err) throw err;
    image.resize(250, 250) 
  });
 
  
  console.log(avatars)
  user.avatarURL = avatars;
  const result = await User.findByIdAndUpdate(user._id, user, { new: true });
  if (!result) {
    throw new Unauthorized("Not found");
  }
  return res.json({"avatarURL": result});
}

module.exports = {
  register,
  login,
  logout,
  current,
  avatars
};