// File: src/main.ts

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SpotifyAuthService } from './spotify/auth/spotify-auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // Fetch and log the Spotify bearer token on startup
  try {
    const authService = app.get(SpotifyAuthService);
    await authService.getAccessToken();
  } catch (error) {
    console.error('Failed to obtain Spotify token on startup:', error);
  }

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
