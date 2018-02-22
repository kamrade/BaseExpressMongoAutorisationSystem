import express from 'express';
let router = express.Router();

// ROOT
router.get('/', (req, res) => {
  res.render('index');
});

export default router;
