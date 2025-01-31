import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ description: 'The name of the client' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The phone number of the client' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'The address of the client' })
  @IsString()
  address: string;
}
