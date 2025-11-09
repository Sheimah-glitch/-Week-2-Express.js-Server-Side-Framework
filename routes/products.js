const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const validateProduct = require('../middleware/validateProduct');
const { NotFoundError, ValidationError } = require('../errors/customErrors');

let products = [];

// CREATE product
router.post('/', validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = { id: uuidv4(), name, description, price, category, inStock };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// UPDATE product
router.put('/:id', validateProduct, (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    const { name, description, price, category, inStock } = req.body;
    Object.assign(product, { name, description, price, category, inStock });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE product
router.delete('/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    products = products.filter(p => p.id !== req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

// LIST products with filtering & pagination
router.get('/', (req, res, next) => {
  try {
    let result = [...products];

    if (req.query.category) {
      result = result.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || result.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResult = result.slice(startIndex, endIndex);

    res.json({
      total: result.length,
      page,
      limit,
      data: paginatedResult
    });
  } catch (err) {
    next(err);
  }
});

// GET product by ID
router.get('/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// SEARCH products by name
router.get('/search', (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) throw new ValidationError('Query parameter "name" is required');
    const result = products.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// PRODUCT statistics
router.get('/stats', (req, res, next) => {
  try {
    const stats = {};
    products.forEach(p => {
      const cat = p.category;
      stats[cat] = stats[cat] ? stats[cat] + 1 : 1;
    });
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
