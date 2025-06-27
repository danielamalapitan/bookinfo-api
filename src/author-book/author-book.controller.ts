import {
  Controller, Post, Param, Delete, Get, ParseIntPipe
} from '@nestjs/common';
import { AuthorBookService } from './author-book.service';

@Controller('author-book')
export class AuthorBookController {
  constructor(private readonly service: AuthorBookService) {}

  @Post('book/:bookId/author/:authorId')
  addAuthor(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('authorId', ParseIntPipe) authorId: number,
  ) {
    return this.service.addAuthorToBook(bookId, authorId);
  }

  @Delete('book/:bookId/author/:authorId')
  removeAuthor(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('authorId', ParseIntPipe) authorId: number,
  ) {
    return this.service.removeAuthorFromBook(bookId, authorId);
  }

  @Delete('book/:bookId/authors')
  removeAllAuthors(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.service.removeAllAuthorsFromBook(bookId);
  }

  @Get('book/:bookId/details')
  getBookWithAuthors(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.service.getBookWithAuthors(bookId);
  }
}
