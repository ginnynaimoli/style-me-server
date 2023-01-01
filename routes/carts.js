const router = require('express').Router()
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middlewares/verifyToken')
const Cart = require('../models/Cart')

//CREATE CART (everyone)
router.post("/", async (req, res) => {
  const newCart = new Cart(req.body)
  try {
    const savedCart = await newCart.save()
    res.status(200).json(newCart)
  } catch (err) {
    res.status(500).json(err)
  }
})

//UPDATE CART (cart owner)
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    //find the products and update all the data in request body
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})

    res.status(200).json(updatedCart)
  } catch (err) {
    res.status(500).json(err)
  }
})

//DELETE CART (cart owner)
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id)
    res.status(200).json('Product has been deleted!')
  } catch (err) {
    res.status(500).json(err)
  }
})

//GET USER CART (for cart owner)
router.get("/find/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
        res.status(200).json(cart)
  } catch (err) {
    res.status(500).json(err)
  }
})

//GET ALL CARTS FROM ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find()
    res.status(200).json(carts)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router