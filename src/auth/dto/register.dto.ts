import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from 'src/user/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
