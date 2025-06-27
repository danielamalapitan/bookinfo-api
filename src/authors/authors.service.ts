import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './entities/author.entity'

@Injectable()
export class AuthorsService {
  
    private authors: Author[] = [];
    private idCounter = 1;

    /*CREATE*/
    create(createAuthorDto: CreateAuthorDto) {
       const isDuplicate = this.authors.some(
            (author) =>
              author.name.toLowerCase() === createAuthorDto.name.toLowerCase()
          );
      
          /*to avoid duplicates, if same author will be added*/
          if (isDuplicate) {
            throw new BadRequestException('An author with the same name already exists.');
          }
      
          const newAuthor: Author = { id: this.idCounter++, ...createAuthorDto };
          this.authors.push(newAuthor);
          return newAuthor;
   
  }

    /*READ all*/
  findAll(): Author[] {
    return this.authors;
  }

    /*READ specific*/
  findOne(id: number): Author | undefined{
    return this.authors.find(author => author.id === id);
  }

    /*UPDATE*/
  update(id: number, dto: CreateAuthorDto): Author | null {
    const index = this.authors.findIndex(author => author.id === id);
    if (index === -1) return null;
    this.authors[index] = { id, ...dto };
    return this.authors[index];
  }

    /*DELETE*/
  remove(id: number): void {
    this.authors = this.authors.filter(author => author.id !== id);
  }
}



