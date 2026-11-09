import { Car } from '../models/Car.js';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

const DEMO_CARS = [
  {
    name: 'Toyota Camry',
    image:
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1080&q=80',
    capacity: 5,
    fuelType: 'Petrol',
    rentPerHour: 25,
  },
  {
    name: 'Honda Civic',
    image:
      'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=1080&q=80',
    capacity: 5,
    fuelType: 'Petrol',
    rentPerHour: 22,
  },
  {
    name: 'Tesla Model 3',
    image:
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1080&q=80',
    capacity: 5,
    fuelType: 'Electric',
    rentPerHour: 45,
  },
  {
    name: 'BMW X5',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1080&q=80',
    capacity: 7,
    fuelType: 'Diesel',
    rentPerHour: 60,
  },
  {
    name: 'Ford Mustang',
    image:
      'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1080&q=80',
    capacity: 4,
    fuelType: 'Petrol',
    rentPerHour: 55,
  },
  {
    name: 'Jeep Wrangler',
    image:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1080&q=80',
    capacity: 5,
    fuelType: 'Diesel',
    rentPerHour: 40,
  },
];

/**
 * Create the default admin account and demo cars the first time the app boots.
 */
export const seedDatabase = async () => {
  try {
    const adminExists = await User.findOne({ username: env.adminUsername });
    if (!adminExists) {
      await User.create({
        username: env.adminUsername,
        password: env.adminPassword,
        role: 'admin',
      });
      console.log(`Seed: admin account created (${env.adminUsername})`);
    }

    const carCount = await Car.countDocuments();
    if (carCount === 0) {
      await Car.insertMany(DEMO_CARS.map((car) => ({ ...car, bookedTimeSlots: [] })));
      console.log(`Seed: ${DEMO_CARS.length} demo cars created`);
    }
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
  }
};
