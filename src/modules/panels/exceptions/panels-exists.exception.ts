'use strict';

import { NotFoundException } from '@nestjs/common';

export class PanelsExistsException extends NotFoundException {
  constructor(error?: string) {
    super('Error. Panel exist!', error);
  }
}
