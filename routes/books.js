const router = require('express').Router();
const Book = require('../models/book.model');

router.get('/', (_, res) => {
    res.render('home');
});

router.get('/myList', (_, res) => {
    // instead of listing the books statically, we are supposed to be pulling them from the db
    Book.find({})
    .lean() // required to turn mongoDB objects into something handlebars can parse
    .exec((err, books) => {
        if (err) return res.status(400).json({'error': 'something went wrong'});
        res.render('list', {
            books
        });
    });
});

router.post('/add', (req, res) => {
    // Search for a book to be added in db. If it exists, return an appropriate response. If not, add it to the db so that it can show up in the list.
    const {workid, title, author} = req.body;

    Book.findOne({workid}, (err, book) => {
        if (err) return console.log(err);
        if(book) return res.json({message: 'This book is already in your collection', added: false});
        Book.create({workid, title, author}, (err, book) => {
            if (err) return console.log(err);
            return res.status(201).json({message: "New book added", added: true});
        });
    })
});

router.get('/edit/:id', (req, res) => {
    // Get the page for editing a book. Instead of listing the book to edit statically, we will be pulling it from the db using the id parameter
    Book.findOne({workid: req.params.id})
    .lean() // required to turn mongoDB objects into something handlebars can parse
    .exec((err, book) => {
        if (err) return console.log(err);
        res.render('edit', {
            book
        });
    });
});

router.post('/edit/:id', (req, res) => {
    // Update the book that we already have in our db using the id parameter.
    const {title, author, review} = req.body;
    const workid = req.params.id;

    Book.updateOne({workid}, {workid, title, author, review}, (err) => {
        if (err) return res.status(400).json({'error': 'something went wrong'});
        res.redirect('/myList');
    });
});

router.delete('/delete/:id', (req, res) => {
    // Search for the book in the db using the id parameter and delete it.
    Book.findOneAndDelete({workid: req.params.id}, (err) => {
        if (err) return res.status(400).json({'error': 'something went wrong'});
        res.json({message: 'Book was removed from your list!'});
    });
});

router.get('/filter', (req, res) => {
    const search = req.query.search;
    Book.find({title: {$regex: search, $options: 'i'}})
    .lean()
    .exec((err, books) => {
        if (err) return res.status(400).json({'error': 'something went wrong'});
        res.json(books);
    })
});

module.exports = router;