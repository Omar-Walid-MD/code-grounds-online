# Code Grounds Online

## Website URL

Visit the live demo: [Code Grounds Online](code-grounds-online.netlify.app)

## Project Overview

Code Grounds Online is a competitive programming website where users compete in solving programming problems in various fast-paced game modes.


### Technologies Used
- **Frontend**: React
- **Styling**: CSS, Bootstrap
- **State Management**: Redux
- **Form Management**: Yup
- **Routing**: React Router
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: Firebase

## Pages
- **Home**: Home page with an entry form or game mode selection if the player is logged in.
- **Waiting**: Shows the players waiting and how much time is left until the game starts.
- **Play**: Runs the game and all its interface with the selected game mode.


## How to Install and Run the Project Locally

If you wish to run **Code Grounds Online** on your local machine, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Omar-Walid-MD/code-grounds-online.git
   ```

2. Navigate into the project directory:
   ```bash
   cd code-grounds-online
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and visit `http://localhost:3000` to see the project in action.

6. Setup a Firebase Project and create a Realtime Database

7. Add Email/Password and Google User Authentications

8. Create .env with the following properties and fill in the values from your Firebase client
    ```
    REACT_APP_FIREBASE_API_KEY=value
    REACT_APP_FIREBASE_AUTH_DOMAIN=value
    REACT_APP_FIREBASE_PROJECT_ID=value
    REACT_APP_FIREBASE_STORAGE_BUCKET=value
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=value
    REACT_APP_FIREBASE_APP_ID=value
    ```