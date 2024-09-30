const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to serve static files from the "public" folder
app.use(express.static('public'));

// Middleware to parse the body of POST requests (to extract form data)
app.use(bodyParser.urlencoded({ extended: true }));

// Home route (GET)
app.get('/', (req, res) => {
  res.render('index');  // Renders the homepage with the button to get a quote
});

app.post('/quote', async (req, res) => {
  try {
    // Make the API request to the correct Stoic Quote API endpoint
    const response = await axios.get('https://stoic.tekloon.net/stoic-quote');

    // Log the response to confirm structure
    console.log(response.data);

    // Extract the quote and author from the response (which is in `response.data.data`)
    const quote = response.data.data.quote;
    const author = response.data.data.author;

    // Render the quote page and pass the quote and author to the view
    res.render('quote', { quote: quote, author: author });
  } catch (error) {
    // Log the error to the console for debugging
    console.error(error);

    // Handle API request error
    res.render('error', { message: 'Failed to fetch the quote. Please try again later.' });
  }
});

// Error route (for invalid pages or errors)
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
