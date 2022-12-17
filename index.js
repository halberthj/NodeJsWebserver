//Here is an example of a web server in Node.js that uses MongoDB as the database and implements endpoints for authentication, creating a new account, and resetting the password using the express and mongodb libraries:
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Replace with your MongoDB connection string
const url = 'mongodb://localhost:27017';
const client = new mongodb.MongoClient(url);
client.connect((err) => {
  if (err) {
    console.log('Error connecting to MongoDB:', err);
  } else {
    console.log('Connected to MongoDB');
  }
});

// Render the login form
app.get('/login', (req, res) => {
  res.send(`
    <html>
      <body>
        <form action="/login" method="post">
          <label for="email">Email:</label>
          <input type="text" id="email" name="email"><br>
          <label for="password">Password:</label>
          <input type="password" id="password" name="password"><br>
          <input type="submit" value="Submit">
        </form> 
      </body>
    </html>
  `);
});

// Handle the login request
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Validate the email and password
  if (!email || !password) {
    res.send('Email and password are required');
    return;
  }
  // Check if the email and password are correct
  const db = client.db('mydb');
  db.collection('users').findOne({ email: email, password: password }, (err, user) => {
    if (err) {
      console.log('Error checking email and password:', err);
      res.send('Error checking email and password');
    } else if (user) {
      // Email and password are correct, log the user in
      res.send('Logged in successfully');
    } else {
      // Email and password are incorrect
      res.send('Incorrect email or password');
    }
  });
});


// Render the create account form
app.get('/create-account', (req, res) => {
    res.send(`
      <html>
        <body>
          <form action="/create-account" method="post">
            <label for="email">Email:</label>
            <input type="text" id="email" name="email"><br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password"><br>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name"><br>
            <input type="submit" value="Submit">
          </form> 
        </body>
      </html>
    `);
  });

// Handle the create account request
app.post('/create-account', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    // Validate the email, password, and name
    if (!email || !password || !name) {
      res.send('Email, password, and name are required');
      return;
    }
    // Check if the email already exists in the database
    const db = client.db('mydb');
    db.collection('users').findOne({ email: email }, (err, user) => {
      if (err) {
        console.log('Error checking email:', err);
        res.send('Error checking email');
      } else if (user) {
        // Email already exists
        res.send('Email already exists');
      } else {
        // Email does not exist, create the new user
        db.collection('users').insertOne({ email: email, password: password, name: name }, (err, result) => {
          if (err) {
            console.log('Error creating new user:', err);
            res.send('Error creating new user');
          } else {
            // New user created successfully
            res.send('New user created successfully');
          }
        });
      }
    });
  });


// Render the forgot password form
app.get('/forgot-password', (req, res) => {
    res.send(`
      <html>
        <body>
          <form action="/forgot-password" method="post">
            <label for="email">Email:</label>
            <input type="text" id="email" name="email"><br>
            <input type="submit" value="Submit">
          </form> 
        </body>
      </html>
    `);
  });
  
  
// Handle the forgot password request
app.post('/forgot-password', (req, res) => {
    const email = req.body.email;
    // Validate the email
    if (!email) {
      res.send('Email is required');
      return;
    }
    // Check if the email exists in the database
    const db = client.db('mydb');
    db.collection('users').findOne({ email: email }, (err, user) => {
      if (err) {
        console.log('Error checking email:', err);
        res.send('Error checking email');
      } else if (user) {
        // Email exists, send a password reset email
        sendPasswordResetEmail(email);
        res.send('Password reset email sent');
      } else {
        // Email does not exist
        res.send('Email does not exist');
      }
    });
  });
  
// Send a password reset email to the given email address
function sendPasswordResetEmail(email) {
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport();
    // Generate a password reset token
    const token = generatePasswordResetToken(email);
    // Set the options for the email
    const mailOptions = {
      from: 'noreply@example.com',
      to: email,
      subject: 'Password Reset',
      text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://localhost:3000/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };
    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log('Error sending password reset email:', err);
        // Handle the error
      } else {
        console.log('Password reset email sent:', info);
        // Email sent successfully
      }
    });
  }
  



// Handle the password reset request
app.post('/reset/:token', (req, res) => {
    const token = req.params.token;
    const password = req.body.password;
    // Validate the token and password
    if (!token || !password) {
      res.send('Token and password are required');
      return;
    }
    // Check if the token is valid
    validatePasswordResetToken(token, (err, email) => {
      if (err) {
        console.log('Error validating password reset token:', err);
        res.send('Error validating password reset token');
      } else if (email) {
        // Token is valid, update the user's password
        const db = client.db('mydb');
        db.collection('users').updateOne({ email: email }, { $set: { password: password } }, (err, result) => {
          if (err) {
            console.log('Error updating password:', err);
            res.send('Error updating password');
          } else {
            // Password updated successfully
            res.send('Password updated successfully');
          }
        });
      } else {
        // Invalid token
        res.send('Invalid token');
      }
    });
  });

  
app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
  