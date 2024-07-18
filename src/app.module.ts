import { Module } from '@nestjs/common';
import { BoardModule } from './board/board.module';
import { BoardController } from './board/board.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BoardModule,
    PrismaModule,
  ],
  controllers: [BoardController],
})
export class AppModule {}
