const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getMemoryStoreStatus } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'brainwave_secret_key_2026';

// In-memory fallback user storage
const memoryUsers = [
  {
    _id: 'user-architect-1',
    name: 'Dr. Aris Thorne',
    email: 'architect@brainwave.io',
    role: 'Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    passwordHash: bcrypt.hashSync('architect123', 10)
  },
  {
    _id: 'user-admin-1',
    name: 'Sarah Vance',
    email: 'admin@brainwave.io',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    passwordHash: bcrypt.hashSync('admin123', 10)
  },
  {
    _id: 'user-client-1',
    name: 'Alex Rivera',
    email: 'client@brainwave.io',
    role: 'Student/Client',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    passwordHash: bcrypt.hashSync('client123', 10)
  }
];

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (getMemoryStoreStatus()) {
      const existing = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) return res.status(400).json({ message: 'User already exists.' });
      const newUser = {
        _id: 'user-' + Date.now(),
        name,
        email,
        role: role || 'Student/Client',
        avatar: '',
        passwordHash: bcrypt.hashSync(password, 10)
      };
      memoryUsers.push(newUser);
      const token = generateToken(newUser);
      return res.status(201).json({
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, avatar: newUser.avatar }
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'Student/Client'
    });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (getMemoryStoreStatus()) {
      const user = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const token = generateToken(user);
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

exports.demoLogin = async (req, res) => {
  try {
    const { role } = req.body; // Architect, Admin, Student/Client
    const selectedRole = role || 'Architect';

    const demoProfiles = {
      Architect: { name: 'Dr. Aris Thorne', email: 'architect@brainwave.io', role: 'Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      Admin: { name: 'Sarah Vance (Admin)', email: 'admin@brainwave.io', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
      'Student/Client': { name: 'Alex Rivera (Client)', email: 'client@brainwave.io', role: 'Student/Client', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }
    };

    const target = demoProfiles[selectedRole] || demoProfiles['Architect'];
    const dummyUser = {
      _id: 'demo-' + selectedRole.toLowerCase().replace('/', '-'),
      name: target.name,
      email: target.email,
      role: target.role,
      avatar: target.avatar
    };

    const token = generateToken(dummyUser);
    res.json({
      token,
      user: { id: dummyUser._id, name: dummyUser.name, email: dummyUser.email, role: dummyUser.role, avatar: dummyUser.avatar }
    });
  } catch (error) {
    console.error('Demo Login Error:', error);
    res.status(500).json({ message: 'Server error during demo login.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authorization token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
