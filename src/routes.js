const {
  storeBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
} = require('./handler');

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
  //* menampilkan detail buku
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
];

module.exports = routes;
