import express from "express";
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auths.js';
import cookieParser from 'cookie-parser';
import multer from "multer";

const app = express();

app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({ storage })

app.post('/api/upload', upload.single('file'), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(8000, ()=>{
    console.log("Listening at 8000!");
})