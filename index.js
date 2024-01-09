const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables from .env file
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/student_registration', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check if the connection to MongoDB is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Student schema
const studentSchema = new mongoose.Schema({
  name: String,
  surname: String,
  birthdate: Date,
  telephone: String,
  address: String,
  city: String,
  zipCode: String,
  state: String,
  country: String,
  hobbies: String,
  qualifications: String,
  languages: String,
});

// Create the Student model
const Student = mongoose.model('Student', studentSchema);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/register', async (req, res) => {
  try {
    // Create a new Student instance with data from the form
    const studentData = {
      name: req.body.name,
      surname: req.body.surname,
      birthdate: req.body.birthdate,
      telephone: req.body.telephone,
      address: req.body.address,
      city: req.body.city,
      zipCode: req.body.zipCode,
      state: req.body.state,
      country: req.body.country,
      hobbies: req.body.hobbies,
      qualifications: req.body.qualifications,
      languages: req.body.languages,
    };

    // Save the student data to MongoDB
    const student = new Student(studentData);
    await student.save();

    // Redirect to the home page
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
