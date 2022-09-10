import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.MC_NESTJS_API_PORT || 3000, '0.0.0.0');
}
bootstrap();
