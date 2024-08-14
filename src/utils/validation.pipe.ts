import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.shouldValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMap = errors.reduce((acc, error) => {
        acc[error.property] = Object.values(error.constraints || {});
        return acc;
      }, {});

      throw new BadRequestException({ message: errorMap });
    }

    return object;
  }

  private shouldValidate(metatype: any): boolean {
    const nonValidatableTypes: any[] = [String, Boolean, Number, Array, Object];
    return !nonValidatableTypes.includes(metatype);
  }
}
