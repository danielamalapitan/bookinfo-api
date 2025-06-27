import { Body, Controller, Post, Get, Param, Put, Delete, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { BookDto } from './dto/book.dto';
import { BooksService } from './books.service';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@UseFilters(HttpExceptionFilter) /*for validation*/
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Post()
    create(@Body() bookDto: BookDto){
        return this.booksService.create(bookDto);
    }

    @Get()
    findAll(){
        return this.booksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return this.booksService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateDto: BookDto){
        return this.booksService.update(+id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.booksService.remove(+id);
    }

}
