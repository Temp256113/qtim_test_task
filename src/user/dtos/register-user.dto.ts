import { NotNullableString } from '../../utils/decorators/not-nullable-string.decorator';

export class RegisterUserDto {
  @NotNullableString('temp256113')
  username: string;

  @NotNullableString('p4$$w0rd')
  password: string;
}
