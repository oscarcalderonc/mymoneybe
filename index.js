const bcrypt = require('bcrypt');
const app = require('./src/app');

const genHash = async () => {
  //console.log(`The hash is ${await bcrypt.hash('putyourpasswordhere', 10)}`);
};

genHash();

const server = app.listen(process.env.SERVER_HTTP_PORT, () => {
  console.log(`Server started in port ${process.env.SERVER_HTTP_PORT}`);
});

module.exports = server;
