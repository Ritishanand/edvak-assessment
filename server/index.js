const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

// Mock data for suggestions
const suggestionsData = [
  'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 'Coconut',
  'Cranberry', 'Cucumber', 'Date', 'Dragonfruit', 'Durian', 'Fig', 'Grape', 'Grapefruit',
  'Guava', 'Kiwi', 'Lemon', 'Lime', 'Lychee', 'Mango', 'Melon', 'Nectarine', 'Orange',
  'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Pineapple', 'Plum', 'Pomegranate', 'Raspberry',
  'Strawberry', 'Tangerine', 'Tomato', 'Watermelon', 'Zucchini'
];

// Route to serve suggestions based on query, page, and limit
app.get('/suggestions', (req, res) => {
  const query = req.query.q || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Filter suggestions based on query
  const filteredSuggestions = suggestionsData.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  // Implement pagination
  const startIndex = (page - 1) * limit;
  const paginatedSuggestions = filteredSuggestions.slice(startIndex, startIndex + limit);

  // Return response
  res.json({
    results: paginatedSuggestions,
    total: filteredSuggestions.length,
    page,
    totalPages: Math.ceil(filteredSuggestions.length / limit),
  });
});

app.use(express.static(path.join(__dirname, '../dist/my-angular-app')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/my-angular-app/index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});
