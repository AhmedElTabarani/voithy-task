const bcrypt = require('bcrypt');

module.exports = isCorrectPassword = async (
  password,
  hashedPassword
) => await bcrypt.compare(password, hashedPassword);
