'use strict';

import { NotFoundException } from '@nestjs/common';

export class PanelsNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('Error. Panel not found!', error);
  }
}
