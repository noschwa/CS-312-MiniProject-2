const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS for templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Use bodyParser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Route for the homepage
app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs
});

// Route to fetch a random cocktail
app.post('/cocktail/random', async (req, res) => {
    try {
        const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const cocktail = response.data.drinks[0]; // Get the first drink

        res.render('cocktail', { cocktail }); // Render cocktail.ejs with cocktail data
    } catch (error) {
        console.error('Error fetching random cocktail:', error);
        res.status(500).render('error'); // Render error.ejs on error
    }
});

// Route to search for a specific cocktail
app.post('/cocktail/search', async (req, res) => {
    const drinkName = req.body.drinkName;

    try {
        const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`);
        const cocktail = response.data.drinks ? response.data.drinks[0] : null; // Get the first drink if exists

        if (cocktail) {
            res.render('cocktail', { cocktail }); // Render cocktail.ejs with cocktail data
        } else {
            res.render('error', { message: 'Cocktail not found!' }); // Render error.ejs if not found
        }
    } catch (error) {
        console.error('Error fetching cocktail:', error);
        res.status(500).render('error'); // Render error.ejs on error
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
