
import { ApiProperty } from '@nestjs/swagger';

export class ApiExceptionModel {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  method: string;

  @ApiProperty()
  error: string;
}
