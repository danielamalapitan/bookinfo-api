import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthorsService } from '../authors/authors.service';
import { BooksService } from '../books/books.service';
import { Author } from '../authors/entities/author.entity';
import { Book } from '../books/entities/books.entity';

@Injectable()
export class AuthorBookService {
  private links: { authorId: number; bookId: number }[] = [];

  constructor(
    private readonly authorsService: AuthorsService,
    private readonly booksService: BooksService,
  ) {}

  addAuthorToBook(bookId: number, authorId: number): string {
    const book = this.booksService.findOne(bookId);
    const author = this.authorsService.findOne(authorId);
    if (!book) throw new NotFoundException(`Book ID ${bookId} not found`);
    if (!author) throw new NotFoundException(`Author ID ${authorId} not found`);

    /*to prevent duplicate linking*/
    const exists = this.links.some(link => link.bookId === bookId && link.authorId === authorId);
    if (exists) throw new BadRequestException(`Author already linked to this book`);

    this.links.push({ bookId, authorId });
    return `Author ${authorId} added to Book ${bookId}`;
  }

  /*only removes a specific author*/
  removeAuthorFromBook(bookId: number, authorId: number): string {
    const before = this.links.length;
    this.links = this.links.filter(link => !(link.bookId === bookId && link.authorId === authorId));
    if (this.links.length === before) {
      throw new NotFoundException(`Author ${authorId} is not linked to Book ${bookId}`);
    }
    return `Author ${authorId} removed from Book ${bookId}`;
  }

  /*remove all*/
  removeAllAuthorsFromBook(bookId: number): string {
    const before = this.links.length;
    this.links = this.links.filter(link => link.bookId !== bookId);
    const removed = before - this.links.length;
    return `${removed} author(s) removed from Book ${bookId}`;
  }

  /*to display the book with the author*/
  getBookWithAuthors(bookId: number): { book: Book; authors: Author[] } {
    const book = this.booksService.findOne(bookId);
    if (!book) throw new NotFoundException(`Book ID ${bookId} not found`);

    const authorIds = this.links
      .filter(link => link.bookId === bookId)
      .map(link => link.authorId);

    const authors = authorIds
      .map(id => this.authorsService.findOne(id))
      .filter((a): a is Author => a !== undefined);

    return { book, authors };
  }
}
