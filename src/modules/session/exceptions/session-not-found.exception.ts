'use strict';

import { NotFoundException } from '@nestjs/common';

export class SessionNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('Error! Session not found!', error);
  }
}
