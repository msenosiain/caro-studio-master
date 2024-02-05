import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterStudentDto } from './dto/register-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './schemas/student.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  create(createStudentDto: RegisterStudentDto): Promise<Student> {
    const createdStudent = new this.studentModel(createStudentDto);
    return createdStudent.save();
  }

  findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  findOne(id: number): Promise<Student> {
    return this.studentModel.findById(id).exec();
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return this.studentModel.findByIdAndUpdate(id, updateStudentDto).exec();
  }

  remove(id: number) {
    return this.studentModel.findByIdAndDelete(id).exec();
  }
}
