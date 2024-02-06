import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './schemas/student.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const createdStudent = await this.studentModel.create(createStudentDto);
    return createdStudent.toJSON();
  }

  findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  findOneById(id: string): Promise<Student> {
    return this.studentModel.findOne({ _id: id }).exec();
  }

  update(id: string, updateStudentDto: UpdateStudentDto) {
    return this.studentModel
      .findOneAndUpdate({ _id: id }, updateStudentDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.studentModel.findOneAndDelete({ _id: id }).exec();
  }
}
