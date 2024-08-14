'use strict';

import { NotFoundException } from '@nestjs/common';

export class UsersExistsException extends NotFoundException {
  constructor(error?: string) {
    super('error.user_exist', error);
  }
}
