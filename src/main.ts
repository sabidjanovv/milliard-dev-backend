import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function start() {
  try {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT || 3030;
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.setGlobalPrefix('api');
    app.enableCors();
    const config = new DocumentBuilder()
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Add the api bearer token',
      })
      .setTitle('Milliard Dev')
      .setDescription(
        'Bu loyiha Milliard Dev loyihasi haqida',
      )
      .setVersion('1.0')
      .addTag('Nestjs, validation, swagger, guard, mongodb')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(PORT, () =>
      console.log(`Server running at port http://localhost:${PORT}`),
    );
  } catch (error) {
    console.error(error);
  }
}
start();
