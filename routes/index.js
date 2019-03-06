var express = require('express');
var router = express.Router();
var Books = require('../models').Books

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/books');
})

router.get('/books', (req, res, next) => {
  Books.findAll({order: [['title', 'ASC']]}).then((books) => {
    res.render('index', { books });
  });
});
// GET update-book
router.get('/books/:id', (req, res, next) => {
  Books.findByPk(req.params.id).then((book) => {
    res.render('update-book', { book });
  });
});

//POST create book
router.post('/books', (req, res, next) => {
  Books.create(req.body).then(() =>{
    res.redirect('/books');
  });
});

//GET new-book
router.get('/new', (req, res) => {
  res.render('new-book', {books: Books.build()})
});




module.exports = router;
