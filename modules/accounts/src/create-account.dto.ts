import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min, IsIn } from 'class-validator';
import type { EntryDirection } from '@shared/models';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Unique identifier for the account (optional, auto-generated if missing)',
    example: '71cde2aa-b9bc-496a-a6f1-34964d05e6fd',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Human-friendly account name or label',
    example: 'Cash',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Direction of the account (“debit” or “credit”)',
    example: 'debit',
    enum: ['debit', 'credit'],
  })
  @IsIn(['debit', 'credit'])
  @IsNotEmpty()
  direction!: EntryDirection;

  @ApiProperty({
    description: 'Account balance in USD (defaults to 0)',
    example: 0,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  balance?: number = 0;
}
