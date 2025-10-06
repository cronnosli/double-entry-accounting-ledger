import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TransactionsUseCase } from './transactions.usecase';
import { CreateTransactionDto } from './create-transaction.dto';
import { Transaction } from './transactions.entity';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsControllerV1 {
  constructor(private readonly transactionsUseCase: TransactionsUseCase) {}

  @Post()
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transaction registered successfully',
    type: Transaction,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or unbalanced transaction',
  })
  async registerTransaction(@Body() dto: CreateTransactionDto) {
    try {
      const mappedDto = {
        ...dto,
        entries: dto.entries?.map((entry) => ({
          ...entry,
          id: entry.id ?? '',
        })),
      };
      const tx = await this.transactionsUseCase.register(mappedDto);
      return tx;
    } catch (e: unknown) {
      if (e instanceof Error) return { error: e.message };
      return { error: 'Unknown error' };
    }
  }
}
