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
  }).catch((err) => {
    res.sendStatus(500);
  });  
});

//GET new-book
router.get('/new', (req, res, next) => {
  res.render('new-book', {books: Books.build()}).catch((err) => {
    res.sendStatus(500);
  });
});

//POST create book
router.post('/books', (req, res, next) => {
  Books.create(req.body).then(() =>{
    res.redirect('/');
  }).catch( (err) => {
    if(err.name === 'SequelizeValidationError'){
      res.render('new-book', {books: Books.build(req.body), errors: err.errors})
    } else {
      throw err;
    }
  }).catch((err) => {
    res.sendStatus(500);
  });  
});

// GET update-book
router.get('/books/:id', (req, res, next) => {
  Books.findByPk(req.params.id).then((book) => {
    res.render('update-book', { book });
  }).catch((err) => {
    res.sendStatus(500);
  });  
});

router.post('/books/:id',(req,res) => {
  Book.findById(req.params.id).then(books => {
      return books.update(req.body); 
  }).then( () => {
    res.redirect('/books')
  }).catch( err => {
    if(err.name === "SequelizeValidationError"){
      var books = Book.build(req.body);
      books.id = req.params.id;
      res.render('update-book', {
        books: books,
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(err => {
    res.send(500);
  })
});








//DELETE book
router.post('/books/:id/delete', (req, res,next) => {
  Books.findByPk(req.params.id).then((book) => {
    return book.destroy();
  }).then(() => {
    res.redirect('/books');
  }).catch((err) => {
    res.sendStatus(500);
  });
});




module.exports = router;
