import { INestApplication } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AccountsModule } from '@accounts/accounts.module';
import { TransactionsModule } from '@transactions/transactions.module';

type AppLike = INestApplication | NestFastifyApplication;

export function setupSwagger(app: AppLike) {
  const config = new DocumentBuilder()
    .setTitle('Ledger API')
    .setDescription('Double-entry ledger API — includes Accounts and Transactions endpoints.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [AccountsModule, TransactionsModule],
  });

  SwaggerModule.setup('/api/docs', app, document);
}
