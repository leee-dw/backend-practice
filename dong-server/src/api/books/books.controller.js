const Book = require('models/book')
const { Types: { ObjectId } } = require('mongoose')

exports.create = async (ctx) => {
  const { title, authors, publishedDate, price, tags } = ctx.request.body

  const book = new Book({
    title, authors, publishedDate, price, tags
  })

  try {
    await book.save()
  } catch (e) {
    return ctx.throw(500, e)
  }

  ctx.body = book
}

exports.list = async (ctx) => {
  let books

  try {
    books = await Book.find()
      .sort({ _id: -1 })
      .limit(3)
      .exec()
  } catch (e) {
    return ctx.throw(500, e)
  }

  ctx.body = books
}

exports.get = async (ctx) => {
  const { id } = ctx.params
  let book
  try {
    book = await Book.findById(id).exec()
  } catch (e) {
    return ctx.throw(500, e)
  }

  if (!book) {
    ctx.status = 404
    ctx.body = { message: 'Book not Found' }
  }

  ctx.body = book
}

exports.delete = async (ctx) => {
  const { id } = ctx.params

  try {
    await Book.findByIdAndRemove(id).exec()
  } catch (e) {
    if (e.name === 'Cast Error') {
      ctx.status = 400
    }
  }

  ctx.status = 204
}

exports.replace = async (ctx) => {
  const { id } = ctx.params

  let book

  try {
    book = await Book.findByIdAndUpdate(id, ctx.request.body, {
      upsert: true,
      new: true
    })
  } catch (e) {
    return ctx.throw(500, e)
  }

  ctx.body = book
}

exports.update = async (ctx) => {
  const { id } = ctx.params // URL 파라미터에서 id 값을 읽어옵니다.

  if (!ObjectId.isValid(id)) {
    ctx.status = 400 // Bad Request
    return
  }

  let book

  try {
    // 아이디로 찾아서 업데이트를 합니다.
    // 파라미터는 (아이디, 변경 할 값, 설정) 순 입니다.
    book = await Book.findByIdAndUpdate(id, ctx.request.body, {
      // upsert 의 기본값은 false 입니다.
      new: true // 이 값을 넣어줘야 반환하는 값이 업데이트된 데이터입니다. 이 값이 없으면 ctx.body = book 했을때 업데이트 전의 데이터를 보여줍니다.
    })
  } catch (e) {
    return ctx.throw(500, e)
  }

  ctx.body = book
}
