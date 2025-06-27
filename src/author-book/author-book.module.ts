import { Module } from '@nestjs/common';
import { AuthorBookService } from './author-book.service';
import { AuthorBookController } from './author-book.controller';
import { BooksModule } from 'src/books/books.module';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
  imports:[AuthorsModule,BooksModule],
  providers: [AuthorBookService],
  controllers: [AuthorBookController]
})
export class AuthorBookModule {}

