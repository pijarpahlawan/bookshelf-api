const {
  storeBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBooksByIdHandler,
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
  //* mengubah data buku
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBooksByIdHandler,
  },
];

module.exports = routes;
