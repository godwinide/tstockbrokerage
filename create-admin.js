const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./model/User');

async function createAdmin() {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.log('\nUsage: node create-admin.js <email>');
      console.log('Example: node create-admin.js admin@example.com\n');
      console.log('This will either:');
      console.log('1. Update existing user to admin');
      console.log('2. Create new admin user if email doesn\'t exist\n');
      process.exit(1);
    }

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user) {
      // Update existing user to admin
      user.isAdmin = true;
      await user.save();
      console.log('\n✅ Success! User updated to admin:');
      console.log('Email:', user.email);
      console.log('Username:', user.username);
      console.log('isAdmin:', user.isAdmin);
      console.log('\nYou can now login at /admin/signin\n');
    } else {
      // Create new admin user
      const password = process.argv[3] || 'admin123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        fullname: 'Admin User',
        username: 'admin',
        email: email.toLowerCase().trim(),
        phone: '1234567890',
        country: 'USA',
        currency: '$',
        password: hashedPassword,
        clearPassword: password,
        isAdmin: true,
        balance: 0,
        totalBonus: 0
      });

      await user.save();
      console.log('\n✅ Success! New admin user created:');
      console.log('Email:', user.email);
      console.log('Password:', password);
      console.log('Username:', user.username);
      console.log('isAdmin:', user.isAdmin);
      console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
