import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function runApp() {
  try {
    const app = await NestFactory.create(AppModule);
    console.log(process.env.PG_HOST);

    const PORT = process.env.PORT || 3001;
    app.enableCors();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    const config = new DocumentBuilder()
      .setTitle('NestJS')
      .setDescription('REST API')
      .setVersion('1.0.0')
      .addTag('NodeJs, NestJs, Postgres, Sequelize')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);
    await app.listen(PORT, () => {
      console.log('Server listening on port', +PORT);
    });
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}
runApp();
