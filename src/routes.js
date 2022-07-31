const { storeBookHandler, getAllBooksHandler } = require('./handler');

const routes = [
  //* menambahkan buku
  {
    method: 'POST',
    path: '/books',
    handler: storeBookHandler,
  },
  //* mendapatkan semua buku
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
];

module.exports = routes;
