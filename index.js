const bcrypt = require('bcrypt');
const app = require('./src/app');

const genHash = async () => {
  //console.log(`The hash is ${await bcrypt.hash('prueba123', 10)}`);
};
//test
genHash();

const server = app.listen(process.env.SERVER_HTTP_PORT || 8080, () => {
  console.log(`Server started in port ${process.env.SERVER_HTTP_PORT}`);
});

module.exports = server;
