import { CreateMovieDto } from "../dto/create-movie.dto"
import { Rating } from "./rating.entity"

export class Movie {

    // omdb fields
    Title: string
    Rated: string
    Poster: string
    Type: string
    Year: string
    imdbID: string
    Released: string
    Runtime: string
    Genre: string
    Director: string
    Writer: string
    Actors: string
    Plot: string
    Language: string
    Country: string
    Awards: string
    ratings: Array<Rating>
    Metascore: string
    imdbRating: string
    imdbVote: string
    DVD: string
    BoxOffice: string
    Production: string
    Website: string
    addedBy: string
    likes: Array<string>

    constructor(createMovieDto: CreateMovieDto, clientId: string) {
        Object.assign(this, createMovieDto)
        this.addedBy = clientId
        this.likes = [clientId]
    }
}
