const {nanoid} = require('nanoid');
const books = require('./books');


exports.getAllBooks = (request, h) => {
  const {reading, finished, name} = request.query;

  const filteredBooks = books.filter((book) => {
    if (name) {
      book.name.toLowerCase().includes(name.toLowerCase());
    }
    book.reading == Boolean(Number(reading)) || book.finished == Boolean(Number(finished));
  });
  const allBooks = filteredBooks.map((book) => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
  });
  console.log(allBooks);

  return h.response({
    'status': 'success',
    'data': {
      'books': allBooks,
    },
  });
};

exports.getBookById = (request, h) => {
  const bookId = request.params.bookId;
  const theBook = books.find(({id}) => id === bookId);
  if (!theBook) {
    return h.response({
      'status': 'fail',
      'message': 'Buku tidak ditemukan',
    }).code(404);
  }
  return h.response({
    'status': 'success',
    'data': {
      'book': theBook,
    },
  }).code(200);
};

exports.addBook = (request, h) => {
  const {
    year,
    name,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid();
  const finished = pageCount == readPage ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const book = {
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

  if (!name) {
    return h.response({
      'status': 'fail',
      'message': 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      'status': 'fail',
      'message': `Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount`,
    }).code(400);
  }

  books.push(book);
  return h.response({
    'status': 'success',
    'message': 'Buku berhasil ditambahkan',
    'data': {
      'bookId': book.id,
    },
  }).code(201);
};

exports.updateBookById = (request, h) => {
  const bookId = request.params.bookId;
  const theBook = books.findIndex(({id}) => id == bookId);
  const {
    year,
    name,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const finished = pageCount == readPage ? true : false;
  const updatedAt = new Date().toISOString();

  if (theBook == -1) {
    return h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  } else {
    if (!name) {
      return h.response({
        'status': 'fail',
        'message': 'Gagal memperbarui buku. Mohon isi nama buku',
      }).code(400);
    }

    if (readPage > pageCount) {
      return h.response({
        'status': 'fail',
        'message': `Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount`,
      }).code(400);
    }

    books[theBook] = {
      ...books[theBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    return h.response({
      'status': 'success',
      'message': 'Buku berhasil diperbarui',
    }).code(200);
  }
};


exports.deleteBookByid = (request, h) => {
  const bookId = request.params.bookId;
  const theBook = books.findIndex(({id}) => id == bookId);

  if (theBook == -1) {
    return h.response({
      'status': 'fail',
      'message': 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  } else {
    books.splice(theBook, 1);
    return h.response({
      'status': 'success',
      'message': 'Buku berhasil dihapus',
    }).code(200);
  }
};
