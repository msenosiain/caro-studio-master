import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

export type StudentDocument = HydratedDocument<Student>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret.password;
      delete ret._id;
      return ret;
    },
  },
})
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

  @Prop({ required: true, select: false })
  password: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.pre('save', function save(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = bcrypt.hashSync(this.password, SALT_WORK_FACTOR);
    return next();
  } catch (err) {
    return next(err);
  }
});

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

StudentSchema.methods.validatePassword = function validatePassword(
  data: string,
): boolean {
  return bcrypt.compareSync(data, this.password);
};
