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
   * @returns idObtained
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

  //* membuat kriteria lolos uji
  const firstCriteria = name !== undefined;
  const secondCriteria = readPage <= pageCount;

  //* apabila kriteria pertama tidak lolos (nama tidak diisi)
  if (!firstCriteria) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  //* apabila kriteria kedua tidak lolos (readPage lebih dari pageCount)
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

  //* apabila terdapat kesalahan server internal
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (h) => {
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

  const books = booksInDetail.map(keepParams);

  const response = h.response({
    status: 'success',
    data: { books },
  });

  return response;
};

module.exports = {
  storeBookHandler,
  getAllBooksHandler,
};
