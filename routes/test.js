const express = require('express');
const router = express.Router();
const Books = require('../models').Books
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/', (req, res) => {
    res.redirect('/books/1');
});

router.get('/books/:page', (req, res, next) => {
    let limit = 10;
    let offset = 0;
    Books.findAndCountAll().then((books) => {
      let page = req.params.page;
      if (page === undefined) {
        page = '1';
      }
      let pages = Math.ceil(books.count / limit);
      offset = limit * (page - 1);
  
      Books.findAll({
        order: [['title', 'ASC']],
        limit: limit,
        offset: offset
      }).then((books) => {
        res.render('index', { books, pages, page });
      });//end render new list based on pagination
    }).catch((err) => {
      res.sendStatus(500);
    });
  });


router.get('/update/:id', (req, res, next) => {
    Books.findByPk(req.params.id).then((book) => {
        if(book) {
            res.render('update-book', { book, id: req.params.id });
        } else {
            res.render('page-not-found');
        }
    }).catch((err) => {
        res.sendStatus(500);
    })
});

router.post('/update/:id', (req, res, next) => {
    Books.findByPk(req.params.id).then((book) => {
        if(book) {
            return book.update(req.body);
        } else {
            res.render('page-not-found');
        }
    }).then((book) => {
        res.redirect('/books/1')
    })
})

module.exports = router;