import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment-timezone';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ versionKey: false })
export class Customer {
  @Prop({ required: false, unique: true })
  username: string;

  @Prop({ required: false, unique: true })
  tg_id: string;

  @Prop({ required: false, unique: true })
  phone_number: string;

  @Prop({ required: false, unique: true })
  email: string;

  @Prop({ required: false })
  first_name: string;

  @Prop({ required: false })
  last_name: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ default: 'ru' })
  lang: string;

  @Prop({ type: String })
  createdAt: string;

  @Prop({ type: String })
  updatedAt: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.pre('save', function (next) {
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

CustomerSchema.pre('findOneAndUpdate', function (next) {
  this.set({
    updatedAt: moment().tz('Europe/Moscow').format('YYYY-MM-DD HH:mm:ss'),
  });
  next();
});
