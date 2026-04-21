import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn, IsInt, Min, Max, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  college?: string;

  @IsString()
  @IsIn(['MBBS', 'BDS', 'Nursing', 'PharmD', 'Allied'])
  programme: string;

  @IsInt()
  @Min(1)
  @Max(5)
  year: number;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
