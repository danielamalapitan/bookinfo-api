import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BookDto } from './dto/book.dto';
import { Book } from './entities/books.entity';

@Injectable()
export class BooksService {
  private books: Book [] = [];
  private idCounter = 1;

  /*CREATE*/
  create(bookDto: BookDto) {
    const isDuplicate = this.books.some(
      (book) =>
        book.title.toLowerCase() === bookDto.title.toLowerCase() 
    );

  /*Will not create another book with the same author*/
    if (isDuplicate) {
      throw new BadRequestException('A book with the same title and author already exists.');
    }

    /*id: this.idCounter++, ...bookDto */
    const newBook: Book = { 
      id: this.idCounter++, 
      title: bookDto.title,
      pubDate: new Date(bookDto.pubDate),
      publisher: bookDto.publisher,
      genre: bookDto.genre,};

    this.books.push(newBook);
    return newBook;
  }

  /*READ all*/
  findAll(){
    return this.books;
  }

  /*READ specific*/
  findOne(id: number) {
    const book = this.books.find((b) => b.id === id);
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    return book;
  }

  /*UPDATE/PUT*/
  update(id: number, updateDto: BookDto){
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) throw new NotFoundException(`Book with id ${id} not found`);
    
    /*{ id, ...updateDto }*/
    const updatedBook: Book = { 
      id, 
      title: updateDto.title,
      pubDate: new Date(updateDto.pubDate),
      publisher: updateDto.publisher,
      genre: updateDto.genre,
      };
    this.books[index] = updatedBook;
    return updatedBook;
  }

  /*DELETE*/
  remove(id:number){
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) throw new NotFoundException(`Book with id ${id} not found`);
    const deleted = this.books[index];
    this.books.splice(index, 1);
    return deleted;
  }

}


