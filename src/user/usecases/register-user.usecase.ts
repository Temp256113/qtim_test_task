import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repositories/user.repository';
import { UserQueryRepository } from '../repositories/user.query-repository';
import { ConflictException } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/register-user.dto';
import * as argon2 from 'argon2';

export class RegisterUserCommand {
  constructor(public data: RegisterUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUsecase
  implements ICommandHandler<RegisterUserCommand, void>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userQueryRepository: UserQueryRepository,
  ) {}

  async execute({ data: command }: RegisterUserCommand): Promise<void> {
    const findUserByUsername = await this.userQueryRepository.getUserByUsername(
      command.username,
    );

    if (findUserByUsername) {
      throw new ConflictException('Username already taken');
    }

    const encryptedPassword = await argon2.hash(command.password);

    await this.userRepository.createUser({
      ...command,
      password: encryptedPassword,
    });
  }
}
