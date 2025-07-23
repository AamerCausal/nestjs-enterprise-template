import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(identifier: string | number) {
    super(`User with identifier '${identifier}' not found`);
  }
}

export class EmailAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`User with email '${email}' already exists`);
  }
}

export class BusinessLogicException extends BadRequestException {
  constructor(message: string, public readonly code: string) {
    super({ message, code });
  }
}