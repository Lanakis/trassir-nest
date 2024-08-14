'use strict';

import { NotFoundException } from '@nestjs/common';

export class SessionExistException extends NotFoundException {
  constructor(error?: string) {
    super('Error! Session already exist!', error);
  }
}
