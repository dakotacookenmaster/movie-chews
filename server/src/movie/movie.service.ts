import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateMovieDto } from './dto/create-movie.dto'
import { Movie } from './entities/movie.entity'
import { remove } from 'lodash'
import { HttpService } from '@nestjs/axios/dist'
import { ConfigService } from '@nestjs/config/dist'
import { map } from 'rxjs'

@Injectable()
export class MovieService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  movies: Array<Movie> = []
  
  create(createMovieDto: CreateMovieDto, userId: string) {
    const existingMovie = this.movies.find(movie => movie.imdbID === createMovieDto.imdbID)

    if(!existingMovie) {
      const movie = new Movie(createMovieDto, userId)
      this.movies = [...this.movies, movie].sort((a, b) => b.likes.length - a.likes.length)
      return movie
    }

    throw new BadRequestException() // FIXME!
  }

  findAll() {
    return this.movies
  }

  remove(imdbID: string, userId: string) {
    const movie = this.movies.find(movie => movie.imdbID === imdbID)
    if (movie && movie.addedBy === userId) {
      remove(this.movies, movie =>
        movie.imdbID === imdbID
      )
    }
  }

  like(imdbID: string, userId: string) {
    this.movies = this.movies.map(movie => {
      if(movie.imdbID === imdbID) {
        if(movie.likes.includes(userId)) {
          remove(movie.likes, like => like === userId)
        } else {
          movie.likes.push(userId)
        }
      }

      return movie
    })

    this.movies.sort((a, b) => b.likes.length - a.likes.length)

    const movie = this.movies.find(movie => movie.imdbID === imdbID)
    if(movie.likes.length === 0) {
      remove(this.movies, (movie) => movie.imdbID === imdbID)
    }
  }

  getLikes(userId: string): Array<Movie> {
    return this.movies.filter(movie => movie.likes.includes(userId))
  }

  wipeLikes(userId: string) {
    this.getLikes(userId).forEach(movie => {
      this.like(movie.imdbID, userId)
    })
  }

  async search(search: string) {
    return this.httpService.get(`http://www.omdbapi.com/?apikey=${this.configService.getOrThrow("API_KEY")}&s=${search}`).pipe(map(axiosResponse => axiosResponse.data))
  }
}
