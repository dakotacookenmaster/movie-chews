import { Module } from '@nestjs/common'
import { MovieService } from './movie.service'
import { MovieGateway } from './movie.gateway'
import { SessionService } from '../session/session.service'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config/dist'

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [MovieGateway, MovieService, SessionService]
})
export class MovieModule {}
