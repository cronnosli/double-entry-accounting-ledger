import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import type { EntryDirection } from '@shared/models';
import { ApiProperty } from '@nestjs/swagger';

export class EntryDto {
  @ApiProperty({
    description: 'ID of the account affected by this entry',
    example: 'fa967ec9-5be2-4c26-a874-7eeeabfc6da8',
  })
  @IsUUID()
  account_id!: string;

  @ApiProperty({
    description: 'Direction of the entry (“debit” or “credit”)',
    example: 'debit',
    enum: ['debit', 'credit'],
  })
  @IsIn(['debit', 'credit'])
  direction!: EntryDirection;

  @ApiProperty({
    description: 'Amount in USD to apply to the account balance',
    example: 100,
  })
  @IsInt()
  @Min(0)
  amount!: number;

  @ApiProperty({
    description: 'Unique ID for the entry (optional, generated if missing)',
    example: 'a5c1b7f0-e52e-4ab6-8f31-c380c2223efa',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;
}
export class CreateTransactionDto {
  @ApiProperty({
    description: 'Unique transaction identifier (optional, auto-generated if missing)',
    example: '3256dc3c-7b18-4a21-95c6-146747cf2971',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Optional name or label for this transaction',
    example: 'Purchase of materials',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Ledger entries that make up this transaction',
    type: [EntryDto],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => EntryDto)
  entries!: EntryDto[];
}
