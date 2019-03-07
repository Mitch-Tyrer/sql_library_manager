var express = require('express');
var router = express.Router();
var Books = require('../models').Books
const Sequelize = require('sequelize');
const Op = Sequelize.Op

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
  res.render('new-book', {book: Books.build()}).catch((err) => {
    res.sendStatus(500);
  });
});

//POST create book
router.post('/new', (req, res, next) => {
  Books.create(req.body).then(() =>{
    res.redirect('/books');
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
    if(book){
      res.render('update-book', { book });
    } else {
      res.render('page-not-found');
    }
  }).catch((err) => {
    res.sendStatus(500);
  });  
});

router.post('/books/:id',(req,res, next) => {
  Books.findByPk(req.params.id).then(books => {
    if(book){
      return books.update(req.body); 
    } else {
      res.render('page-not-found');
    }
  }).then( () => {
    res.redirect('/books')
  }).catch( err => {
    if(err.name === "SequelizeValidationError"){
      var book = Books.build(req.body);
      book.id = req.params.id;
      res.render('update-book', {
        book,
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(err => {
    res.sendStatus(500);
  })
});

// SEARCH ROUTE
router.post('/search', (req, res, next) => {
  console.log(req.body.search)
  Books.findAll({
    where: {
      [Op.or]: {
        title: {
          [Op.like]: `%${req.body.search}%`
        },
        author: {
          [Op.like]: `%${req.body.search}%`
        },
        genre: {
          [Op.like]: `%${req.body.search}%`
        },
        year: {
          [Op.like]: `%${req.body.search}%`
        }
      }
    }
  }).then((books) => {
    res.render('index', { books });
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
