# Login Use Case

---

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Usage](#usage)
4. [Configuration](#configuration)
5. [Contributing](#contributing)

---

## Introduction

This project is a React-based authentication system that includes login, registration, and password recovery features. It uses Firebase for user authentication and supports email/password as well as OAuth providers like Google and Apple.

**Note:** On the home page, you can uncomment the `<AuthAnimation />` component to display a Lottie animation.


## Features

- User registration with email and password.
- User login with email and password.
- Password strength validation during registration.
- OAuth authentication using Google and Apple.
- Clear error messages for common authentication issues.
- Responsive design with conditional rendering for login and registration.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- [PocketBase](https://pocketbase.io) (download the executable)

### Installation

1. Clone the repository:
git clone https://github.com/HugoQuintal01/pocketbase-login-use-case.git

2. Navigate to the project directory:
cd login-use-case

3. Install dependencies:
npm install

4.	Set up PocketBase:
- Download PocketBase:
   - Download the appropriate PocketBase executable from the official releases page for your operating system.
- Run PocketBase:
   - Place the pocketbase executable in the root of the project directory and start the PocketBase server:
   - ./pocketbase serve
- Import Collections:
   - If you have been provided with a JSON file containing the collections, import it into PocketBase using the admin UI or the command line.
- Configure the frontend to connect to PocketBase:
   - Ex: REACT_APP_POCKETBASE_URL=http://localhost:8090


### Usage

1. Start the Development Server:
Navigate to the project directory and run npm start. This will start the development server and open the project in your default web browser. If it doesn’t open automatically, you can manually navigate to http://localhost:3000 in your browser.

2. Run Tests:
To run the unit tests, use npm test. This will execute the test suite using Jest.

3. Build for Production:
To create a production build of the project, run npm run build. The build artifacts will be output to the build directory.

4. Lint the Code:
To check for linting errors, use npm run lint.

5. Format the Code:
To format the codebase, run npm run format. This will apply consistent code formatting using Prettier.

6. Install Dependencies:
To install project dependencies, run npm install.

## Configuration

The project uses environment variables to configure Firebase. You can set these variables in the .env file in the root directory.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes and commit them with a descriptive commit message.
4. Push your changes to your forked repository.
5. Create a pull request to merge your changes into the main repository.

Remember to follow the project's coding standards and best practices when contributing.

---

I hope this helps! Let me know if you have any questions.

---

Check more projects at:
https://hugoquintal.pt/