
const express = require('express');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const PORT = 5000;

app.use(express.json());

app.use('/customer', session({
  secret: 'fingerprint_customer',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  }
}));

// Authentication middleware
app.use('/customer/auth', (req, res, next) => {
  if (!req.session || !req.session.authorization) {
    return res.status(401).json({
      message: 'Please login first'
    });
  }

  next();
});

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
