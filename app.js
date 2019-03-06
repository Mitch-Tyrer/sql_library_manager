const express = require('express');

const app = express();

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index');
}); //Home get

app.get('/new-book', (req, res) => {
    res.render('new-book');
});

app.get('/update-book', (req, res) => {
    res.render('update-book');
});




app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

app.use((err, req, res, next) => {
    res.locals.error = err;
    console.error(err.status, err.message)
    res.status(err.status);
    res.render('page-not-found');
  });


app.listen(3000, () => {
    console.log('Running on localhost:3000');
});