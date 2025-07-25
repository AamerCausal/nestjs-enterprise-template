import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger documentation
  SwaggerConfig.setup(app);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application running on: http://localhost:${process.env.PORT || 3000}/api`);
  console.log(`Swagger docs: http://localhost:${process.env.PORT || 3000}/api/docs`);
}

bootstrap();
