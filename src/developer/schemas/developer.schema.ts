import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment-timezone';

export type DeveloperDocument = Developer & Document;

@Schema({ versionKey: false })
export class Developer {
  @Prop({ type: String, required: true })
  full_name: string;

  @Prop({ type: String })
  tg_link?: string;

  @Prop({ type: String })
  linkedln_link?: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, unique: true })
  phone_number: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String, required: false, ref: 'Admin' })
  adminId?: string;

  @Prop({ type: String, ref: 'Admin' })
  updaterAdminId?: string;

  @Prop({ type: String })
  createdAt: string;

  @Prop({ type: String })
  updatedAt: string;
}

export const DeveloperSchema = SchemaFactory.createForClass(Developer);

DeveloperSchema.pre('save', function (next) {
  if (!this.createdAt) {
    this.set({
      createdAt: moment().tz('Europe/Moscow').format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  this.set({
    updatedAt: moment().tz('Europe/Moscow').format('YYYY-MM-DD HH:mm:ss'),
  });
  next();
});

DeveloperSchema.pre('findOneAndUpdate', function (next) {
  this.set({
    updatedAt: moment().tz('Europe/Moscow').format('YYYY-MM-DD HH:mm:ss'),
  });
  next();
});
