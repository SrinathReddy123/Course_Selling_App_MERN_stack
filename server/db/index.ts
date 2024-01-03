import mongoose, { Document, Schema, Model } from 'mongoose';

const MONGO_URI: string | undefined = process.env.MONGO_URI;
// Define mongoose schemas
interface IUser extends Document {
  username: string;
  password: string;
  purchasedCourses: Array<Object>;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

interface IAdmin extends Document {
  username: string;
  password: string;
}

const adminSchema: Schema<IAdmin> = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

interface ICourse extends Document {
  title: string;
  description: string;
  price: number;
  imageLink: string;
  published: boolean;
}

const courseSchema: Schema<ICourse> = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageLink: { type: String, required: true },
  published: { type: Boolean, required: true },
});

const User: Model<IUser> = mongoose.model('User', userSchema);
const Admin: Model<IAdmin> = mongoose.model('Admin', adminSchema);
const Course: Model<ICourse> = mongoose.model('Course', courseSchema);

export { User, Admin, Course };
