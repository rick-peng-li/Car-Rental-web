import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { seedDatabase } from './utils/seed.js';

const start = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(env.port, () => {
    console.log(`Car Rental API listening on http://localhost:${env.port}`);
  });
};

start();
