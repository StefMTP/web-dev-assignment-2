const express = require('express');
const path = require('path');
const ehbs = require('express-handlebars');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.engine('handlebars', ehbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const uri = process.env.ATLAS_URI;
mongoose.connect(
    uri, 
    {
        useNewUrlParser: true, 
        useCreateIndex: true, 
        useUnifiedTopology: true
    },
    (err) => {
    if (err) return console.log(err);
    console.log('Connected with MongoDB successfully');
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/books'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
