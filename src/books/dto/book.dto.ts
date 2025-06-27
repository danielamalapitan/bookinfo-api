import { IsString, IsDate, IsIn} from 'class-validator';
import { Type, Transform } from 'class-transformer'

const allowedGenres = ['fiction', 'novel', 'mystery', 'science-fiction', 'non-fiction'];

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
    @IsIn(allowedGenres, {
    message: `Genre must be one of: ${allowedGenres.join(', ')}`
    })
    genre: string;

}