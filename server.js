const app = require('./app');
const dbConnect = require('./dbConnect');

module.exports = dbConnect
  .then(async () => {
    console.log('> Database connected successfully');
    const port = process.env.PORT || 3030;
    return app.listen(port, () =>
      console.log(`Listening on port http://localhost:${port} ...`)
    );
  })
  .catch((err) => {
    console.log('something got wrong while database connecting', err);
  });
