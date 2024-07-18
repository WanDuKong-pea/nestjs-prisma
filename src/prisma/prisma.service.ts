import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  INestApplication,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

// PrismaService는 PrismaClient를 확장하고
// OnModuleInit, OnModuleDestroy 인터페이스를 구현한다.
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }

  // 모듈이 초기화될 때 호출됨
  // PrismaClient의 $connect() 메서드를 호출하여 DB와 연결을 설정함
  async onModuleInit() {
    await this.$connect();
  }

  // 모듈이 종료될 떄 호출됨
  // PrismaClient의 $disconnect() 메서드를 호출하여 DB 연결 해제
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // 애플리케이션 종료 전 호출됨
  // beforeExit 이벤트가 발생할 떄 애플리케이션을 닫음
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }
}
