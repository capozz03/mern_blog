import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import multer from 'multer';
dotenv.config();

import {
  registerValidation,
  loginValidation,
  postCreateValidation
} from './validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

mongoose
  .connect('mongodb://localhost:27017/blog?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false')
  .then(() => console.log('DB OK'))
  .catch(() => console.log('DB Not work'))

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, 'uploads');
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage
});

// позволяет читать json запрос, иначе возвращает undefined в request
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
})