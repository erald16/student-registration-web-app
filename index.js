const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables from .env file
require('dotenv').config();

// MongoDB connection
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:3000/student-db', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect("mongodb+srv://emirashi12:ZzDxNuQiTqHbODZb@student-db.35lkoft.mongodb.net/?retryWrites=true&w=majority")
const db = mongoose.connection;

// Check if the connection to MongoDB is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Course schema
const courseSchema = new mongoose.Schema({
  course_name: String,
});
const Course = mongoose.model('Course', courseSchema);

// Define the Student schema
const studentSchema = new mongoose.Schema({
  name: String,
  surname: String,
  birthdate: Date,
  telephone: String,
  email: String,
  gender: String,
  address: String,
  city: String,
  zipCode: String,
  state: String,
  country: String,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  hobbies: String,
  qualifications: String,
  languages: String,
});

// Create the Student model
const Student = mongoose.model('Student', studentSchema);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

// Route to retrieve all courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to handle course data from Salesforce
app.post('/courses', async (req, res) => {
  try {
    // Create a new Course instance with data from Salesforce
    const courseData = {
      course_name: req.body.course_name,
    };

    // Save the course data to MongoDB
    const course = new Course(courseData);
    await course.save();

    // Respond with a success message
    res.status(201).json({ message: 'Course created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to retrieve all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Modify your registration route to fetch courses and render the form
app.get('/register', async (req, res) => {
  try {
    const courses = await Course.find({}, 'name');
    res.render('register', { courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/register', async (req, res) => {
  try {
    // Create a new Student instance with data from the form

    const selectedCourses = req.body.courses;
    const studentData = {
      name: req.body.name,
      surname: req.body.surname,
      birthdate: req.body.birthdate,
      email: req.body.email,
      gender: req.body.gender,
      telephone: req.body.telephone,
      address: req.body.address,
      city: req.body.city,
      zipCode: req.body.zipCode,
      state: req.body.state,
      country: req.body.country,
      courses: selectedCourses,
      hobbies: req.body.hobbies,
      qualifications: req.body.qualifications,
      languages: req.body.languages,
    };

    // Save the student data to MongoDB
    const student = new Student(studentData);
    await student.save();

    // Redirect to the home page
    res.redirect('/');
    console.log('STUDENT INSERTED SUCCESSFULLY');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
