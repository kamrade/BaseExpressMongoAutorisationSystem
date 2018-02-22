import express from 'express';
let router = express.Router();

// REGISTER ROUTE
router.get('/register', (req, res) => {
  res.render('register');
});

// LOGIN ROUTE
router.get('/login', (req, res) => {
  res.render('login');
});

export default router;
