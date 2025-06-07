import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ModulesModule } from './modules/modules.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [PrismaModule, AuthModule, ModulesModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
