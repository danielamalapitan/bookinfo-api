import { Controller, Post, Body, Get, Param, Put, Delete, NotFoundException, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './entities/author.entity';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@UseFilters(HttpExceptionFilter) /*validation*/
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  create(@Body() dto: CreateAuthorDto): Author {
    return this.authorsService.create(dto);
  }

  @Get()
  findAll(): Author[] {
    return this.authorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Author {
    const author = this.authorsService.findOne(+id);
  if (!author) {
    throw new NotFoundException(`Author with id ${id} not found`);
  }
  return author;
}

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateAuthorDto): Author | null {
    return this.authorsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    return this.authorsService.remove(+id);
  }
}
