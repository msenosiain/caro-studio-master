import { RegisterStudentDto } from './register-student.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateStudentDto extends OmitType(RegisterStudentDto, [
  'email',
  'password',
] as const) {}
