const router = require('express').Router()
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken')
const Product = require('../models/Product')

//CREATE PRODUCT (only admin)
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body)
  try {
    const savedProduct = await newProduct.save()
    res.status(200).json(newProduct)
  } catch (err) {
    res.status(500).json(err)
  }
})

//UPDATE PRODUCT (only admin)
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    //find the products and update all the data in request body
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})

    res.status(200).json(updatedProduct)
  } catch (err) {
    res.status(500).json(err)
  }
})

//DELETE PRODUCT (only admin)
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json('Product has been deleted!')
  } catch (err) {
    res.status(500).json(err)
  }
})

//GET PRODUCT (for everybody)
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
        res.status(200).json(product)
  } catch (err) {
    res.status(500).json(err)
  }
})

//GET ALL PRODUCTS (everybody)
router.get("/", async (req, res) => {
  const queryNew = req.query.new
  const queryCategory = req.query.category
  try {
    let products
    if(queryNew) {
      products = await Product.find().sort({ createdAt: -1}).limit(1)
    } else if (queryCategory) {
      products = await Product.find({ categories: { $in: [queryCategory] }})
    } else {
      products = await Product.find()
    }
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router