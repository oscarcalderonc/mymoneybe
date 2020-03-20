const app = require('./src/app');

const server = app.listen(process.env.SERVER_HTTP_PORT, () => {
  console.log(`Server started in port ${process.env.SERVER_HTTP_PORT}`);
});

module.exports = server;
