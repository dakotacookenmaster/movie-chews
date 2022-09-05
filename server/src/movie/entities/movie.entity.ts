import { CreateMovieDto } from "../dto/create-movie.dto"

export class Movie {
    
    // omdb fields
    Title: string
    Poster: string
    Type: string
    Year: string
    imdbID: string
    
    addedBy: string
    likes: Array<string>

    constructor(createMovieDto: CreateMovieDto, clientId: string) {
        const { Title, Poster, Type, Year, imdbID } = createMovieDto
        this.addedBy = clientId
        this.Title = Title
        this.Poster = Poster
        this.Type = Type
        this.Year = Year
        this.imdbID = imdbID
        this.likes = [clientId]
    }
}
