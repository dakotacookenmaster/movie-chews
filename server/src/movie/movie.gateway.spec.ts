import { Test, TestingModule } from '@nestjs/testing';
import { MovieGateway } from './movie.gateway';
import { MovieService } from './movie.service';

describe('MovieGateway', () => {
  let gateway: MovieGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieGateway, MovieService],
    }).compile();

    gateway = module.get<MovieGateway>(MovieGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
