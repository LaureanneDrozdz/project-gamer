import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExcludePasswordInterceptor } from './interceptors/exclude-password.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalInterceptors(new ExcludePasswordInterceptor());

  const config = new DocumentBuilder()
    .setTitle('API Challenge Gaming')
    .setDescription('API pour la plateforme de challenges de jeux vidéo')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
