// File: src/lastfm/lastfm.module.ts

import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeezerModule } from '../deezer/deezer.module';
import { LastfmController } from './lastfm.controller';
import { LastfmService } from './lastfm.service';
import { LastfmAuthService } from './auth/lastfm-auth.service';

@Module({
    imports: [HttpModule, ConfigModule, forwardRef(() => DeezerModule)],
    controllers: [LastfmController],
    providers: [LastfmService, LastfmAuthService],
    exports: [LastfmService],
})
export class LastfmModule {}
