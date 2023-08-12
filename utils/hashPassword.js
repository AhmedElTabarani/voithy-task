const bcrypt = require('bcrypt');

module.exports = hashPassword = async (password) =>
  await bcrypt.hash(password, 12);
