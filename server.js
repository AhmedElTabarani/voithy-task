const app = require('./app');
const dbConnect = require('./dbConnect');

dbConnect
  .then(async () => {
    console.log('> Database connected successfully');
    const port = process.env.PORT || 3030;
    app.listen(port, () =>
      console.log(`Listening on port http://localhost:${port} ...`)
    );
  })
  .catch((err) => {
    console.log('something got wrong while database connecting', err);
  });
