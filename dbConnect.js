const mongoose = require('mongoose');
module.exports = mongoose.connect(process.env.CONNECT_DB);
