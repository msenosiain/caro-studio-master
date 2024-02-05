import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true, index: true })
  lastName: string;

  @Prop({ required: true, unique: true, max: 99999999 })
  idNumber: number;

  @Prop({ required: true, max: Date.now() })
  birthDate: Date;

  @Prop({
    required: true,
    unique: true,
    match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
  })
  email: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.virtual('fullName')
  .set(function (fullName: string) {
    const [firstName, lastName] = fullName.split(' ');
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

StudentSchema.virtual('age').get(function () {
  const ageDifMs = Date.now() - this.birthDate.getTime();
  const ageDate = new Date(ageDifMs); // milliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});
