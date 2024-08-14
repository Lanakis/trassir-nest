'use strict';

import { NotFoundException } from '@nestjs/common';

export class ExternalUsersExistsException extends NotFoundException {
  constructor(error?: string) {
    super('Error. Panel exist!', error);
  }
}
