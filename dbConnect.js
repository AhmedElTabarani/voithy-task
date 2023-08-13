const mongoose = require('mongoose');
module.exports = mongoose.connect(
  process.env.NODE_ENV === 'test'
    ? process.env.CONNECT_DB_TEST
    : process.env.CONNECT_DB
);
