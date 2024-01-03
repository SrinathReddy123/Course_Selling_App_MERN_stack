import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import adminRouter from './routes/admin';
import userRouter from './routes/user';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/admin', adminRouter);
app.use('/user', userRouter);

app.get('/', (req: Request, res: Response) => res.json({ msg: 'hello world after the class' }));

// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
mongoose.connect('mongodb+srv://mohanthanneeru10:oI4lOT45nUHLLzrS@letschatapp.5qjnc6g.mongodb.net/courses', {
  dbName: 'courses'
});

app.listen(3000, () => console.log('Server running on port 3000'));
