const { nanoid } = require('nanoid');
const booksInDetail = require('./books');

//* menambahkan buku
const storeBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  /**
   * Membuat id buku
   * @returns id buku
   */
  function getId() {
    const idObtained = nanoid(24);
    if (booksInDetail.find((book) => book.id === idObtained)) {
      getId();
    }
    return idObtained;
  }

  const id = getId();
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // membuat kriteria lolos uji
  const firstCriteria = name !== undefined;
  const secondCriteria = readPage <= pageCount;

  // apabila kriteria pertama tidak lolos (nama tidak diisi)
  if (!firstCriteria) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // apabila kriteria kedua tidak lolos (readPage lebih dari pageCount)
  if (!secondCriteria) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  booksInDetail.push(newBook);

  const isSuccess = booksInDetail.find((book) => book.id === id);

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // apabila terdapat kesalahan server internal
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

//* mendapatkan semua buku
const getAllBooksHandler = (request, h) => {
  /**
   * Menghilangkan properti selain id, name, dan publisher
   * @param {*} buku detail buku
   * @returns sisa properti yang dibutuhkan
   */
  function keepParams({
    year,
    author,
    summary,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
    ...keep
  }) {
    return keep;
  }

  // array buku yang baru dengan properti id, name, dan publisher
  const books = booksInDetail.map(keepParams);

  const response = h.response({
    status: 'success',
    data: { books },
  });
  return response;
};

//* menampilkan detail buku
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = booksInDetail.find((b) => b.id === bookId);

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  // apabila buku tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  storeBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
};
