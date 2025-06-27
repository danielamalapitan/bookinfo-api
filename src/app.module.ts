import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { AuthorBookModule } from './author-book/author-book.module';


@Module({
  imports: [BooksModule, AuthorsModule, AuthorBookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
