const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET_KEY).toString()
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOG IN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    !user && res.status(401).json('Wrong Credentials!')

    const hashedPassword = CryptoJS.AES.decrypt(user?.password, process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8)
    hashedPassword !== req.body.password && res.status(401).json('Wrong Credentials!')
    
    //create JWT if user found
    const accessToken = jwt.sign(
      {
        id: user._id, 
        isAdmin: user.isAdmin
      }, 
      process.env.JWT_SECRET_KEY, 
      {expiresIn: '3d'}
    )

    //remove password from user info to front end display
    const { password, ...others } = user._doc

    res.status(200).json({ ...others, accessToken })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;