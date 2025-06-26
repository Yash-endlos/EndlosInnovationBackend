import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
// import booksRoutes from './routes/booksRoutes.js';
import { connectDB } from './lib/db.js';
import job from './lib/cron.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();
const PORT = process.env.PORT || 3005;

job.start();         // for physical phone make it open and for simulator make it close
app.use(express.json());
app.use(cors());
app.use("/api/auth" , authRoutes)
// app.use("/api/books" , booksRoutes)
app.use("/api/categories", categoryRoutes);
app.listen(PORT , ()=>{
  console.log(`Server is running on ${PORT}`)
  connectDB();
})