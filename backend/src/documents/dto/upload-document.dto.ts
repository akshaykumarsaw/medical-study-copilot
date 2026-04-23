import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsEnum(['textbook', 'notes', 'question_paper'])
  type: 'textbook' | 'notes' | 'question_paper';
}
