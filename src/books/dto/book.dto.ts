import { IsString, IsDate, IsEnum} from 'class-validator';
import { Type, Transform } from 'class-transformer'

export enum allowedGenres{
    FICTION = 'fiction',
    NOVEL = 'novel',
    MYSTERY = 'mystery',
    SCIENCE_FICTION = 'science fiction',
    NON_FICTION = ' non-fiction',
}

export class BookDto{
    @IsString()
    title: string;

    @IsDate()
    @Type(() => Date)
    pubDate: Date;

    @IsString()
    publisher: string;

    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    @IsEnum(allowedGenres, {
    message: `Genre must be one of: ${Object.values(allowedGenres).join(', ')}`
    })
    genre: allowedGenres;

}