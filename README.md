# Webserver

This webserver is built with Node.js and MongoDB and provides the following functionality:

- Login
- Create new account
- Forgot password

## Getting Started

To run the webserver locally, follow these steps:

1. Install Node.js and MongoDB on your machine.
2. Clone the repository and navigate to the project directory.
3. Install the required dependencies by running `npm install`.
4. Replace the `url` variable in `index.js` with your MongoDB connection string.
5. Start the webserver by running `node index.js`.

The webserver will be listening on port 3000. You can access the login page at `http://localhost:3000/login`, the create account page at `http://localhost:3000/create-account`, and the forgot password page at `http://localhost:3000/forgot-password`.

## Routes

The webserver has the following routes:

### `POST /login`

This route handles login requests. It expects the following data in the request body:

- `email`: the email address of the user
- `password`: the password of the user

If the email and password are correct, it responds with a `200 OK` status and the message "Logged in successfully". If the email or password is incorrect, it responds with a `400 Bad Request` status and the message "Incorrect email or password".

### `POST /create-account`

This route handles create account requests. It expects the following data in the request body:

- `email`: the email address of the user
- `password`: the password of the user
- `name`: the name of the user

If the email is already in use, it responds with a `400 Bad Request` status and the message "Email already exists". If the email, password, and name are all valid, it creates a new user in the database and responds with a `200 OK` status and the message "New user created successfully". If there is an error creating the new user, it responds with a `500 Internal Server Error` status and the message "Error creating new user".

### `POST /forgot-password`

This route handles forgot password requests. It expects the following data in the request body:

- `email`: the email address of the user

If the email is not found in the database, it responds with a `400 Bad Request` status and the message "Email does not exist". If the email is found, it sends a password reset email to the user and responds with a `200 OK` status and the message "Password reset email sent". If there is an error sending the email, it responds with a `500 Internal Server Error` status and the message "Error sending password reset email".

### `POST /reset/:token`

This route handles password reset requests. It expects the following data in the request body:

- `password`: the new password for the user

It also expects the password reset token to be passed in the URL as a parameter.

If the token is invalid or expired, it responds with a `400 Bad Request` status and the message "Invalid token". If the token is valid, it updates the password of the user associated with the token in the database and responds with a `200 OK` status and the message "Password reset successfully". If there is an error updating the password, it responds with a `500 Internal Server Error` status and the message "Error resetting password".


## Dependencies

- `express`: ^4.17.1
- `mongodb`: ^3.7.1
- `nodemailer`: ^6.4.6

## Notes

- Make sure you have a SMTP server configured to send the password reset emails.
- You may need to set up email authentication (e.g., OAuth2) in order to send emails from your server.
