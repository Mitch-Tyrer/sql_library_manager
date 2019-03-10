var express = require('express');
var router = express.Router();
var Books = require('../models').Books
const Sequelize = require('sequelize');
const Op = Sequelize.Op


/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/books/1');
})

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
      if(page <= pages){
        res.render('index', { books, pages, page });
      } else {
        res.render('page-not-found');
      }
    });//end render new list based on pagination
  }).catch((err) => {
    res.sendStatus(500);
  });
});

//GET new-book
router.get('/new', (req, res, next) => {
  res.render('new-book', { book: Books.build() })
});

//POST create book
router.post('/new', (req, res, next) => {
  Books.create(req.body).then(() => {
    res.redirect('/');
  }).catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      res.render('new-book', { book: Books.build(req.body), errors: err.errors })
    } else {
      throw err;
    }
  }).catch((err) => {
    res.sendStatus(500);
  });
});

// GET update-book
router.get('/update/:id', (req, res, next) => {
  let id = req.params.id;
  Books.findByPk(id).then((book) => {
    if (book) {
      res.render('update-book', { book, id });
    } else {
      res.render('page-not-found');
    }
  }).catch((err) => {
    res.sendStatus(500);
  });
});

router.post('/update/:id', (req, res, next) => {
  let id = req.params.id;
  Books.findByPk(id).then(book => {
    if (book) {
      return book.update(req.body);
    } else {
      res.render('page-not-found');
    }
  }).then(() => {
    res.redirect('/books/1')
  }).catch(err => {
    if (err.name === "SequelizeValidationError") {
      var book = Books.build(req.body);
      res.render('update-book', {
        book,
        id,
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
router.get('/search/:page/', (req, res, next) => {
  let limit = 10;
  let offset = 0;
  let { search } = req.query;
  Books.findAndCountAll({
    where: {
      [Op.or]: {
        title: {
          [Op.like]: `%${search}%`
        },
        author: {
          [Op.like]: `%${search}%`
        },
        genre: {
          [Op.like]: `%${search}%`
        },
        year: {
          [Op.like]: `%${search}%`
        }
      }
    }
  }).then((books) => {
    let page = req.params.page;
    if (page === undefined) {
      page = '1';
    }
    let pages = Math.ceil(books.count / limit);
    offset = limit * (page - 1);

    Books.findAll({
      where: {
        [Op.or]: {
          title: {
            [Op.like]: `%${search}%`
          },
          author: {
            [Op.like]: `%${search}%`
          },
          genre: {
            [Op.like]: `%${search}%`
          },
          year: {
            [Op.like]: `%${search}%`
          }
        }
      },
      order: [['title', 'ASC']],
      limit: limit,
      offset: offset
    }).then((books) => {
      if(search){
        res.render('index', { books, pages, page, url: req.path, search });
      } else {
        res.redirect('/');
    }
    });//end render new list based on pagination
  }).catch((err) => {
    res.sendStatus(500);
  });
});



//DELETE book
router.post('/books/:id/delete', (req, res, next) => {
  Books.findByPk(req.params.id).then((book) => {
    return book.destroy();
  }).then(() => {
    res.redirect('/');
  }).catch((err) => {
    res.sendStatus(500);
  });
});


module.exports = router;
