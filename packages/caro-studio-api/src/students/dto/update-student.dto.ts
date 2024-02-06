import { CreateStudentDto } from './create-student.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateStudentDto extends PartialType(
  OmitType(CreateStudentDto, ['email', 'password'] as const),
) {}
