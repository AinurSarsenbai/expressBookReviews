
const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');

const regd_users = express.Router();

let users = [];

// Check if a username exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Authenticate a registered user
const authenticatedUser = (username, password) => {
  return users.some(user =>
    user.username === username &&
    user.password === password
  );
};

// Task 8 - Login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: 'Invalid username or password'
    });
  }

  const token = jwt.sign(
    { username },
    'access',
    { expiresIn: '1h' }
  );

  req.session.authorization = {
    accessToken: token,
    username: username
  };

  return res.status(200).json({
    message: 'User successfully logged in'
  });
});

// Task 9 - Add or Modify Book Review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review || req.body?.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({
      message: 'Please login first'
    });
  }

  if (!books[isbn]) {
    return res.status(404).json({
      message: 'Book not found'
    });
  }

  if (!review) {
    return res.status(400).json({
      message: 'Review is required'
    });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: 'Review added/updated successfully'
  });
});

// Task 10 - Delete Book Review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({
      message: 'Please login first'
    });
  }

  if (!books[isbn]) {
    return res.status(404).json({
      message: 'Book not found'
    });
  }

  if (!books[isbn].reviews ||
      !Object.prototype.hasOwnProperty.call(
        books[isbn].reviews,
        username
      )) {
    return res.status(404).json({
      message: 'Review not found'
    });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: 'Review deleted successfully'
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
