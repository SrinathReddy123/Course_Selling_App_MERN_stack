import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User, Course, Admin } from '../db';
import { authenticateJwt } from '../middleware/auth';

const { SECRET } = require('../middleware/auth');
const router: Router = Router();

router.get('/me', authenticateJwt, async (req: Request, res: Response) => {
  const admin = await Admin.findOne({ username: req.user.username }).exec();
  if (!admin) {
    res.status(403).json({ msg: 'Admin doesn\'t exist' });
    return;
  }
  else {
    res.json({
      username: admin.username,
    });  
  }
});

router.post('/signup', (req: Request, res: Response) => {
  const { username, password } = req.body;
  function callback(admin: any) {
    if (admin) {
      res.status(403).json({ message: 'Admin already exists' });
    } else {
      const obj = { username: username, password: password };
      const newAdmin = new Admin(obj);
      newAdmin.save();

      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Admin created successfully', token });
    }
  }
  Admin.findOne({ username }).then(callback);
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.headers as { username: string; password: string };
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

router.post('/courses', authenticateJwt, async (req: Request, res: Response) => {
  const course = new Course(req.body);
  await course.save();
  res.json({ message: 'Course created successfully', courseId: course.id });
});

router.put('/courses/:courseId', authenticateJwt, async (req: Request, res: Response) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

router.get('/courses', authenticateJwt, async (req: Request, res: Response) => {
  const courses = await Course.find({});
  res.json({ courses });
});

router.get('/course/:courseId', authenticateJwt, async (req: Request, res: Response) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  res.json({ course });
});

export default router;
