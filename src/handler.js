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
   * Menjaga properti id, name, dan publisher dan menghilangkan property lainnya
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
  let books = booksInDetail.map(keepParams);

  // filtering response sesuai dengan query yang diminta
  let { name, reading, finished } = request.query;

  if (name !== undefined) {
    name = name.toLowerCase();
    books = booksInDetail
      .filter((book) => book.name.toLowerCase().includes(name))
      .map(keepParams);
  } else if (reading === '1' || reading === '0') {
    reading = reading === '1';
    books = booksInDetail
      .filter((book) => book.reading === reading)
      .map(keepParams);
  } else if (finished === '1' || finished === '0') {
    finished = finished === '1';
    books = booksInDetail
      .filter((book) => book.finished === finished)
      .map(keepParams);
  }

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

//* menampilkan detail buku
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = booksInDetail.find((b) => b.id === bookId);

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  // apabila buku tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

//* mengubah data buku
const editBookByIdHandler = (request, h) => {
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
  const { bookId } = request.params;
  const index = booksInDetail.findIndex((book) => book.id === bookId);
  const updatedAt = new Date().toISOString();

  // membuat kriteria lolos uji
  const firstCriteria = name !== undefined;
  const secondCriteria = readPage <= pageCount;
  const thirdCriteria = index > -1;

  // apabila kriteria pertama tidak lolos (nama tidak diisi)
  if (!firstCriteria) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // apabila kriteria kedua tidak lolos (readPage lebih dari pageCount)
  if (!secondCriteria) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // apabila kriteria ketiga tidak lolos (id tidak ditemukan)
  if (!thirdCriteria) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // memperbarui data buku
  booksInDetail[index] = {
    ...booksInDetail[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

//* menghapus data buku berdasarkan id
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = booksInDetail.findIndex((book) => book.id === bookId);
  const criteria = index > -1;

  // jika kriteria terpenuhi (terdapat buku dengan indeks yang dicari)
  if (criteria) {
    booksInDetail.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  storeBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
