import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AccountsUseCase } from './accounts.usecase';
import { CreateAccountDto } from './create-account.dto';
import { Account } from './account.entity';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsControllerV1 {
  constructor(private readonly accountsUseCase: AccountsUseCase) {}

  @Post()
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    type: Account,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(@Body() dto: CreateAccountDto) {
    try {
      return this.accountsUseCase.createAccount(dto);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return { error: e.message };
      }
      return { error: 'An unknown error occurred' };
    }
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Returns account data',
    type: Account,
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  async findOne(@Param('id') id: string) {
    try {
      const account = await this.accountsUseCase.getAccount(id);
      if (!account) {
        throw new NotFoundException('Account not found');
      }
      return account;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new NotFoundException(e.message);
      }
      throw new NotFoundException('Account not found');
    }
  }
}
