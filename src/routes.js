const { storeBookHandler } = require('./handler');

const routes = [
  //* menambahkan buku
  {
    method: 'POST',
    path: '/books',
    handler: storeBookHandler,
  },
];

module.exports = routes;
