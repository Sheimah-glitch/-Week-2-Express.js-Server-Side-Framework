function auth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'mysecretkey') {
    return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }
  next();
}

module.exports = auth;
