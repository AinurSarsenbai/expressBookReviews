
const express = require('express');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

// Task 7 - Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: 'User already exists'
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: 'User successfully registered'
  });
});

// Task 2 - Get all books
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Task 3 - Search by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({
      message: 'Book not found'
    });
  }

  return res.status(200).json(book);
});

// Task 4 - Search by author
public_users.get('/author/:author', (req, res) => {
  const result = {};

  Object.keys(books).forEach(isbn => {
    if (books[isbn].author.toLowerCase() ===
        req.params.author.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  });

  return res.status(200).json(result);
});

// Task 5 - Search by title
public_users.get('/title/:title', (req, res) => {
  const result = {};

  Object.keys(books).forEach(isbn => {
    if (books[isbn].title.toLowerCase() ===
        req.params.title.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  });

  return res.status(200).json(result);
});

// Task 6 - Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({
      message: 'Book not found'
    });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
