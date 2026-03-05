## Assignment 2 – Hardcoded Menu Server

This project includes a simple Node.js/Express server and a React Native app.  
The server is used to satisfy the Assignment 2 requirements.

### Deliverables

- **Single server file**: All backend code and menu data live in one file: `server.js`.
- **Working catalog link**: A URL that returns the product catalog in text/JSON format.
- **Updated README**: Simple instructions on how to run the server.

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Start the hardcoded menu server

The backend server for **Assignment 2** is in `server.js`.

- To start the server, run:

```bash
node server.js
```

The server will start on port **3001** and you will see:

```text
Server running on http://localhost:3001
```

### 3. Working links

- **Catalog (Q1 + Q2)**  
  Open this URL in your browser:

  `http://localhost:3001/menu`

  This returns a list of food items in JSON/text.  
  Each item includes:
  - `name`
  - `price`
  - `category`
  - `image` (direct image URL from the web)

- **Order logger (Q3)**  
  POST endpoint used by the React Native app:

  `http://localhost:3001/order`

  Send a POST request with JSON (for example, from the app or Postman).  
  The server will **print the order details to the terminal**, simulating a manager receiving the order.

### 4. Optional: run the React Native app

If you also want to run the mobile app UI:

```bash
npx expo start
```

Then open the app in Expo Go, an emulator, or the web browser as instructed in the Expo CLI output.
