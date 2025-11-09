function validateProduct(req, res, next) {
  const { name, price, category } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Missing required fields: name, price, category' });
  }
  next();
}

module.exports = validateProduct;
