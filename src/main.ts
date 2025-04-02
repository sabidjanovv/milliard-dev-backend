// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ValidationPipe } from '@nestjs/common';
// import { join } from 'path';
// import { NestExpressApplication } from '@nestjs/platform-express';

// async function start() {
//   try {
//     const app = await NestFactory.create<NestExpressApplication>(AppModule);
//     const PORT = process.env.PORT || 3030;
//     app.useGlobalPipes(new ValidationPipe({ transform: true }));
//     app.setGlobalPrefix('api');
//     app.useStaticAssets(join(__dirname, '..', 'uploads'), {
//       prefix: '/uploads', // URL orqali kirish uchun
//     });
//     app.enableCors();
//     const config = new DocumentBuilder()
//       .addBearerAuth({
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT',
//         description: 'Add the api bearer token',
//       })
//       .setTitle('Milliard Dev')
//       .setDescription('Bu loyiha Milliard Dev loyihasi haqida')
//       .setVersion('1.0')
//       .addTag('Nestjs, validation, swagger, guard, mongodb')
//       .build();

//     const document = SwaggerModule.createDocument(app, config);
//     SwaggerModule.setup('api/docs', app, document);

//     await app.listen(PORT, () =>
//       console.log(`Server running at port http://localhost:${PORT}`),
//     );
//   } catch (error) {
//     console.error(error);
//   }
// }
// start();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function start() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const PORT = process.env.PORT || 3030;

    // Validation va prefixni sozlash
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.setGlobalPrefix('api');

    // Static fayllarni sozlash
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads', // URL orqali kirish uchun
    });

    // CORSni faollashtirish
    app.enableCors();

    // Swagger sozlamalari
    const config = new DocumentBuilder()
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Add the api bearer token',
      })
      .setTitle('Milliard Dev')
      .setDescription('Bu loyiha Milliard Dev loyihasi haqida')
      .setVersion('1.0')
      .addTag('Nestjs, validation, swagger, guard, mongodb')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Serverni ishga tushurish
    await app.listen(PORT, () => {
      Logger.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    Logger.error('Application startup failed', error);
  }
}

start();
