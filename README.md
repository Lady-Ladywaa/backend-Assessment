# Fullstack Shopping Cart Integration Assessment

A fullstack web application built with an **Express.js** REST API backend and a **React** (Vite) frontend. The application manages a product catalog in a shopping cart scenario with complete CRUD functionality, query-string searching/filtering, request logging, input validation, and real-time state synchronization.

---

## 📁 Repository Structure

```
jsd-backend-assessment/
├── client/                     # Frontend React application (Vite)
│   ├── src/
│   │   ├── components/         # React UI Components
│   │   │   ├── Header.jsx      # Navbar & Inventory statistics
│   │   │   ├── SearchBar.jsx   # Filter input using query strings
│   │   │   ├── ProductCard.jsx # Product card item
│   │   │   ├── ProductFormModal.jsx # Add/Edit modal form
│   │   │   └── StatusBanner.jsx   # Loading, Error & Empty state banners
│   │   ├── App.jsx             # Main application component & state logic
│   │   └── index.css           # Modern design system styling
│   ├── .env                    # VITE_API_URL environment variable
│   └── package.json
├── server/                     # Backend Express REST API
│   ├── routes/
│   │   └── products.js         # Express router for product endpoints
│   ├── models/                 # Data model specifications
│   ├── index.js                # Server entry point, middleware & error handling
│   ├── requests.http           # REST Client test file for endpoints
│   └── package.json
├── ASSESSMENT-BRIEF.md         # Assessment requirements brief
├── LEARNERS-RUBRIC.md          # Evaluation rubric & score bands
├── MY_UNDERSTANDING_TEMPLATE.md# Template for written questions
├── my-understanding.md         # Completed assessment written answers
└── README.md                   # This project guide
```

---

## 🚀 How to Run Locally

Both the backend server and frontend client must be running simultaneously in separate terminal windows.

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### 1. Start the Express Backend Server

Open a terminal and navigate to the `server/` directory:

```bash
cd server
npm install
npm run dev
```

> **Server details:**
> - Runs on **`http://localhost:3000`**
> - Command `npm run dev` executes `node --watch index.js` for automatic server reloading upon changes.

### 2. Start the React Frontend Application

Open a second terminal window and navigate to the `client/` directory:

```bash
cd client
npm install
npm run dev
```

> **Client details:**
> - Runs on **`http://localhost:5173`**
> - Reads `VITE_API_URL` from `client/.env` (default: `http://localhost:3000`).

---

## 📡 API Endpoints Reference

| Method | Route | Description | Query / Body Params | Status Codes |
|---|---|---|---|---|
| **GET** | `/products` | Fetch all products | Optional query: `?name=search_term` | `200 OK` |
| **GET** | `/products/:id` | Fetch a single product by ID | Route param: `:id` | `200 OK`, `404 Not Found` |
| **POST** | `/products` | Create a new product | Body: `{ name, price, quantity }` | `201 Created`, `400 Bad Request` |
| **PUT** | `/products/:id` | Update an existing product | Route param: `:id`<br>Body: `{ name, price, quantity }` | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/products/:id` | Delete a product by ID | Route param: `:id` | `200 OK`, `404 Not Found` |

---

## 🧪 Testing the API directly

You can test all endpoints independently of the frontend using the VS Code **REST Client** extension or Postman.
Open `server/requests.http` and click "Send Request" above any request block.

---

## 📝 Assessment Submission Documents
- **`my-understanding.md`**: Written explanations for all 20 assessment questions covering Backend, Frontend & Integration, and AI process reflections.
