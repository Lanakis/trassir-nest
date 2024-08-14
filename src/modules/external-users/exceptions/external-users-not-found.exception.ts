'use strict';

import { NotFoundException } from '@nestjs/common';

export class ExternalUsersNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('Error. Panel not found!', error);
  }
}
