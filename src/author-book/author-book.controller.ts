import { Controller, Post, Delete, Body, Put, Get, BadRequestException, Param, ParseIntPipe } from '@nestjs/common';
import { AuthorBookService } from './author-book.service';

@Controller('author-book')
export class AuthorBookController {
  constructor(private readonly service: AuthorBookService) {}

  @Post('add-authors')
  addAuthors(@Body() body: { bookId: number; authorIds: number[] | number }) {
    return this.service.addAuthorsToBook(body.bookId, body.authorIds);
  }

  @Put('replace-authors')
  replaceAuthors(
    @Body()
    body: {
      bookId: number;
      replacements:
        | { oldAuthorId: number; newAuthorId: number }
        | { oldAuthorId: number; newAuthorId: number }[];
    },
  ) {
    return this.service.replaceAuthors(body.bookId, body.replacements);
  }

  @Delete('remove-authors')
  removeAuthors(@Body() body: { bookId: number; authorIds: number | number[] }) {
    return this.service.removeMultipleAuthorsFromBook(body.bookId, body.authorIds);
  }

  @Delete('remove-all-authors')
  removeAllAuthors(@Body() body: { bookId: number }) {
    return this.service.removeAllAuthorsFromBook(body.bookId);
  }

  @Post('get-book-details')
  getBookWithAuthors(@Body() body: { bookId: number }) {
    return this.service.getBookWithAuthors(body.bookId);
  }

   @Delete('book/:bookId')
  deleteBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return { message: this.service.deleteBook(bookId) };
  }

  @Delete('author/:authorId')
  deleteAuthor(@Param('authorId', ParseIntPipe) authorId: number) {
    return { message: this.service.deleteAuthor(authorId) };
  }

}
