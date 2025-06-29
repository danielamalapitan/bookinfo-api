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

  addAuthorsToBook(bookId: number, authorIds: number[] | number): string {
    const book = this.booksService.findOne(bookId);
    if (!book) throw new NotFoundException(`Book ID ${bookId} not found`);

    const ids = Array.isArray(authorIds) ? authorIds : [authorIds];
    const added: number[] = [];
    for (const authorId of ids) {
      const author = this.authorsService.findOne(authorId);
      if (!author) throw new NotFoundException(`Author ID ${authorId} not found`);

      const exists = this.links.some(link => link.bookId === bookId && link.authorId === authorId);
      if (!exists) {
        this.links.push({ bookId, authorId });
        added.push(authorId);
      }
    }

    return `Authors ${added.join(', ')} added to Book ${bookId}`;
  }

  replaceAuthors(bookId: number, replacements: { oldAuthorId: number; newAuthorId: number }[] | { oldAuthorId: number; newAuthorId: number }): { message: string[] } {
    const book = this.booksService.findOne(bookId);
    if (!book) throw new NotFoundException('Book not found');

    const reps = Array.isArray(replacements) ? replacements : [replacements];
    const messages: string[] = [];

    for (const { oldAuthorId, newAuthorId } of reps) {
      const oldAuthor = this.authorsService.findOne(oldAuthorId);
      const newAuthor = this.authorsService.findOne(newAuthorId);

      if (!oldAuthor || !newAuthor) {
        messages.push(`Author not found for IDs ${oldAuthorId} or ${newAuthorId}`);
        continue;
      }

      const index = this.links.findIndex(
        link => link.bookId === bookId && link.authorId === oldAuthorId,
      );

      if (index === -1) {
        messages.push(`Old author ${oldAuthorId} is not linked to book ${bookId}`);
        continue;
      }

      const alreadyLinked = this.links.some(
        link => link.bookId === bookId && link.authorId === newAuthorId,
      );

      if (alreadyLinked) {
        messages.push(`Author ${newAuthorId} is already linked to book ${bookId}`);
        continue;
      }

      this.links[index].authorId = newAuthorId;
      messages.push(`Author ${oldAuthorId} replaced with ${newAuthorId}`);
    }

    return {
      message: messages,
    };
  }

  removeAuthorFromBook(bookId: number, authorId: number): string {
    const before = this.links.length;
    this.links = this.links.filter(link => !(link.bookId === bookId && link.authorId === authorId));
    if (this.links.length === before) {
      throw new NotFoundException(`Author ${authorId} is not linked to Book ${bookId}`);
    }
    return `Author ${authorId} removed from Book ${bookId}`;
  }

  removeMultipleAuthorsFromBook(bookId: number, authorIds: number[] | number): string[] {
    const ids = Array.isArray(authorIds) ? authorIds : [authorIds];
    const messages: string[] = [];
    for (const authorId of ids) {
      const before = this.links.length;
      this.links = this.links.filter(link => !(link.bookId === bookId && link.authorId === authorId));
      if (this.links.length === before) {
        messages.push(`Author ${authorId} was not linked to Book ${bookId}`);
      } else {
        messages.push(`Author ${authorId} removed from Book ${bookId}`);
      }
    }
    return messages;
  }

  removeAllAuthorsFromBook(bookId: number): string {
    const before = this.links.length;
    this.links = this.links.filter(link => link.bookId !== bookId);
    const removed = before - this.links.length;
    return `${removed} author(s) removed from Book ${bookId}`;
  }

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

 canDeleteBook(bookId: number): boolean {
    const linkedAuthors = this.links.filter(link => link.bookId === bookId);
    return linkedAuthors.length === 0;
  }

  canDeleteAuthor(authorId: number): boolean {
    const linkedBooks = this.links.filter(link => link.authorId === authorId);
    return linkedBooks.length === 0;
  }

  deleteBook(bookId: number): string {
    if (!this.canDeleteBook(bookId)) {
      throw new BadRequestException('Book has linked authors');
    }
    const deleted = this.booksService.remove(bookId);
    if (!deleted) throw new NotFoundException(`Book ${bookId} not found`);

    // call BooksService or handle deletion here
    return `Book ${bookId} deleted`;
  }

  deleteAuthor(authorId: number): string {
    if (!this.canDeleteAuthor(authorId)) {
      throw new BadRequestException('Author has linked books');
    }
     const deleted = this.authorsService.remove(authorId);
     if (!deleted) throw new NotFoundException(`Author ${authorId} not found`);
     
    // call AuthorsService or handle deletion here
    return `Author ${authorId} deleted`;
  }  
}
