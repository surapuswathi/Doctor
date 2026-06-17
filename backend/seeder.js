const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const DoctorProfile = require('./models/DoctorProfile');
const Appointment = require('./models/Appointment');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/book-a-doctor');

const importData = async () => {
  try {
    // Clear existing collections
    await Appointment.deleteMany();
    await DoctorProfile.deleteMany();
    await User.deleteMany();

    console.log('Database cleared...');

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890',
    });

    // 2. Create Pre-Approved Doctor
    const doc1 = await User.create({
      name: 'Dr. Sarah Connor',
      email: 'doctor1@gmail.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '9876543210',
      gender: 'Female',
      address: '742 Evergreen Terrace, Medical District',
    });

    await DoctorProfile.create({
      user: doc1._id,
      specialization: 'Cardiologist',
      experience: 12,
      fees: 600,
      bio: 'Board-certified cardiologist with over a decade of clinical experience treating complex heart conditions.',
      qualifications: 'MD, DM (Cardiology), FACC',
      status: 'approved',
      availability: [
        {
          day: 'Monday',
          slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        },
        {
          day: 'Wednesday',
          slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        },
        {
          day: 'Friday',
          slots: ['09:00 AM', '10:00 AM', '11:00 AM'],
        },
      ],
    });

    // 3. Create Pending Doctor
    const doc2 = await User.create({
      name: 'Dr. James Carter',
      email: 'doctor2@gmail.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '8765432109',
      gender: 'Male',
      address: '101 Blue Ridge Road, Heights Clinic',
    });

    await DoctorProfile.create({
      user: doc2._id,
      specialization: 'Pediatrician',
      experience: 6,
      fees: 400,
      bio: 'Dedicated pediatrician helping families achieve child wellness, developmental milestones, and preventative care.',
      qualifications: 'MBBS, MD (Pediatrics)',
      status: 'pending',
      availability: [
        {
          day: 'Tuesday',
          slots: ['10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'],
        },
        {
          day: 'Thursday',
          slots: ['10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'],
        },
      ],
    });

    // 4. Create Patient
    const patient = await User.create({
      name: 'John Doe',
      email: 'patient@gmail.com',
      password: 'patient123',
      role: 'patient',
      phone: '7654321098',
      gender: 'Male',
      dob: new Date('1992-08-15'),
      address: '456 Elm Street, Metropolis',
    });

    // 5. Create Sample Appointment (John Doe with Dr. Sarah Connor)
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 2); // 2 days in the future
    appointmentDate.setUTCHours(0, 0, 0, 0);

    await Appointment.create({
      patient: patient._id,
      doctor: doc1._id,
      date: appointmentDate,
      timeSlot: '10:00 AM',
      status: 'pending',
      symptoms: 'Mild chest tightness during moderate exercise, seeking cardiovascular consultation.',
    });

    console.log('Database seeded successfully with Admin, Patient, Doctor, and Appointments!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Appointment.deleteMany();
    await DoctorProfile.deleteMany();
    await User.deleteMany();

    console.log('Database cleared completely!');
    process.exit();
  } catch (error) {
    console.error(`Error clearing database: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
