const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/user');
const Event = require('./models/event'); // Correct model for events
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Mongoose Connected');
  })
  .catch((err) => {
    console.error('Error Connecting:', err);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173', 
}));

const jwtSec = 'Anu@2345';  // Security key (recommend storing in .env)
const bcryptSalt = bcrypt.genSaltSync(10);  // Salt for password hashing

// Start the server
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

// User Registration Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPass = bcrypt.hashSync(password, bcryptSalt);  // Hash password
  try {
    const createdUser = await User.create({ username, password: hashedPass }); 
    jwt.sign({ userId: createdUser._id, username }, jwtSec, {}, (err, token) => {
      if (err) {
        console.error('JWT Signing Error:', err);
        return res.status(500).json({ error: 'Token generation failed' });
      }
      res.cookie('token', token).status(201).json({
        id: createdUser._id,
        username: createdUser.username,
      });
    });
  } catch (err) {
    console.error('User Creation Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/calendar/:id', async (req, res) => {
    const { id } = req.params;  // Get user id from the request parameters
    try {
      const events = await Event.find({ userId: id });  // Find events for the specific user
      const selectedDate = new Date();  // Optionally, use a specific selected date logic
      res.json({ events, selectedDate });  // Return events and selectedDate
    } catch (err) {
      console.error('Error fetching events:', err);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });
  
  app.post('/login' , async(req,res) => {
    const {username , password} = req.body;
    const userDoc = await User.findOne({username});
    console.log(userDoc)
    const matchPass = bcrypt.compareSync(password , userDoc.password);
    if(matchPass){
      jwt.sign({userId:userDoc._id , username} , jwtSec , {} , (err , token) => {
        res.cookie('token' , token).json({
          id: userDoc._id,
          username: userDoc.username
        })
      })
    }
  })
  app.post('/addEvent/:id', async (req, res) => {
  const { title, start, end } = req.body;
  const {id} = req.params;

  // Create a new event instance
  const event = new Event({
    userId: id,  
    title,
    start,
    end,
  });

  try {
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error('Error saving event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});
