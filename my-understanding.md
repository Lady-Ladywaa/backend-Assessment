# My Understanding

Answer each question in your own words. There are no trick questions.

The goal is not a perfect answer — it is an honest one. Write as if you are explaining to a friend who has never used Express or React. There is no video for this assessment, so this document is where your understanding is actually assessed — take it seriously.

Do not copy from documentation, your code comments, or AI output. If you are unsure about something, write what you do understand and note where the gap is.

---

## AI Code Contribution

Rate yourself honestly using the scale below. This rating is not scored on its own — there is no "best" number to pick. What matters is that it's honest and matches what your code and your answers actually show.

| Rating | Description |
|---|---|
| 0 | **No AI use.** I did not use AI to generate code, explain concepts, debug, or teach me. |
| 1 | **AI used only for learning.** I did not use AI to generate code, but I used AI to explain concepts, clarify errors, or guide my understanding. |
| 2 | **Mixed coding with AI support.** I wrote some code myself and used some AI-generated code. I also used AI to help me understand, debug, or improve my solution. |
| 3 | **Learned from AI-generated code, then coded myself.** AI generated example code or guidance, but I used that understanding to write or adapt the final code myself. |
| 4 | **AI generated the code, but I fully understand it.** AI generated most or all of the code, but I can explain how it works, why it works, and how the main parts connect. |
| 5 | **AI generated the code with limited understanding.** AI generated most or all of the code, and I cannot confidently explain how or why everything works. |

**My rating:** 4

> If you rated **2 or higher**, also complete the "AI Process" section at the end of this document.

---

## Backend

**1. What does each HTTP method in your API mean — GET, POST, PUT or PATCH, and DELETE? Why do we use different methods instead of just using POST for everything?**

*Your answer:*
- **GET**: Used to retrieve or read data from the server without modifying anything (safe & idempotent). For example, `GET /products` fetches all products.
- **POST**: Used to create a new resource on the server. For example, `POST /products` creates a new product with the data sent in the request body.
- **PUT / PATCH**: Used to update an existing resource. `PUT` replaces the entire resource or updates all specified fields, while `PATCH` makes partial updates. In our API, `PUT /products/:id` updates an existing product's name, price, and quantity.
- **DELETE**: Used to remove a resource from the server. For example, `DELETE /products/:id` deletes the product matching that ID.

**Why not use POST for everything?**  
Using HTTP methods correctly establishes a standardized RESTful interface (semantic HTTP). It makes the API predictable for clients, enables browsers and proxies to cache `GET` requests safely, allows security firewalls to enforce rule policies (e.g., blocking `DELETE` or `PUT` for read-only users), and makes code maintenance clean and self-documenting.

---

**2. What is `express.json()` and what would happen if you left it out?**

*Your answer:*
`express.json()` is built-in Express middleware that parses incoming HTTP requests with JSON payloads (when the `Content-Type: application/json` header is present) and converts that raw JSON body into a JavaScript object attached to `req.body`.

If you leave `express.json()` out, Express will not parse the incoming request body automatically. When your server routes attempt to access `req.body` (such as in `POST /products` or `PUT /products/:id`), `req.body` will be `undefined`. Attempting to destructure `{ name, price, quantity }` from `undefined` will crash the route handler or throw a `TypeError: Cannot destructure property 'name' of 'req.body' as it is undefined`.

---

**3. What is the difference between `req.body`, `req.params`, and `req.query`? Give a real example from your API for each one.**

*Your answer:*
- **`req.body`**: Contains key-value pairs of data submitted in the request payload (typically formatted as JSON in POST or PUT requests).
  - *Example in code*: In `POST /products`, we read `const { name, price, quantity } = req.body;` to extract the product details sent by the client.
- **`req.params`**: Contains route parameters extracted directly from the URL path defined with colon placeholders (e.g., `:id`).
  - *Example in code*: In `DELETE /products/:id` or `GET /products/:id`, when a request is made to `/products/2`, `req.params.id` equals `"2"`.
- **`req.query`**: Contains key-value pairs appended after the `?` symbol in the URL (query string), usually used for filtering, searching, sorting, or pagination.
  - *Example in code*: In `GET /products?name=mouse`, `req.query.name` equals `"mouse"`, allowing our route handler to filter products by name.

---

**4. What are HTTP status codes? List every status code you used in your API and explain why you chose it for that situation.**

*Your answer:*
HTTP status codes are 3-digit standardized numerical responses returned by the server to inform the client about the outcome of an HTTP request.

Status codes used in our API:
- **`200 OK`**: Standard response for successful HTTP requests.
  - *Used in*: `GET /products` (returns list of products), `GET /products/:id` (returns requested product), `PUT /products/:id` (returns updated product), and `DELETE /products/:id` (returns success confirmation).
- **`201 Created`**: Returned when a request succeeds and a new resource has been created.
  - *Used in*: `POST /products` after successfully adding the new product to our products array.
- **`400 Bad Request`**: Returned when the server cannot process the request due to invalid or missing client data payload.
  - *Used in*: `POST /products` and `PUT /products/:id` when required fields like `name` or `price` are missing, empty, or invalid (e.g., negative price).
- **`404 Not Found`**: Returned when the requested resource or URL route does not exist.
  - *Used in*: `GET /products/:id`, `PUT /products/:id`, and `DELETE /products/:id` when the specified product ID cannot be found in the array, as well as our unknown route fallback middleware.
- **`500 Internal Server Error`**: Generic error code indicating an unexpected condition or unhandled exception occurred on the server.
  - *Used in*: Our global error-handling middleware (`app.use((err, req, res, next) => ...)`).

---

**5. What is middleware? Describe what it does in your own words and give one example from your code.**

*Your answer:*
Middleware functions are functions that execute sequentially during the request-response lifecycle in Express. They have access to the request object (`req`), response object (`res`), and the `next` function in the stack. Middleware can execute code, modify request/response objects, end the response cycle early, or pass control to the next middleware by calling `next()`.

*Example from code*: Our custom request logger middleware defined in `server/index.js`:
```javascript
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware/route handler
});
```
This logs every incoming request's timestamp, HTTP method, and URL to the terminal before passing the request to the matching product routes.

---

**6. Why does the order of middleware matter in Express? What could go wrong if it were in the wrong order?**

*Your answer:*
Express executes middleware sequentially in the exact order they are registered via `app.use()`. If control is not passed down or if order is incorrect, previous middleware won't execute for subsequent routes.

**What could go wrong?**
1. If `express.json()` is placed *after* `app.use("/products", productRoutes)`, any incoming `POST` or `PUT` request will reach the product routes *before* the JSON payload is parsed. Consequently, `req.body` will be `undefined` inside the route handlers.
2. If the global error-handling middleware `(err, req, res, next)` is placed at the top instead of at the very end of the file, it will fail to catch errors thrown inside route handlers because Express route handlers haven't been registered yet.

---

**7. Walk through what happens on the server, step by step, when a POST request is sent to `/products`.**

*Your answer:*
1. **Request Received**: The Express server receives an incoming HTTP POST request at `/products` with `Content-Type: application/json` and a JSON body (e.g., `{"name": "Mouse", "price": 500, "quantity": 2}`).
2. **CORS Middleware**: The request passes through `cors()`, which appends appropriate CORS headers allowing the frontend origin (`http://localhost:5173`) to communicate with the API.
3. **JSON Parser**: The request enters `express.json()`, which reads the raw JSON body and populates `req.body` as a JavaScript object.
4. **Logger Middleware**: The custom logging middleware prints `[timestamp] POST /products` to the server console and calls `next()`.
5. **Route Router**: Express matches the path `/products` and method `POST` in `server/routes/products.js`.
6. **Input Validation**: The POST handler checks `if (!name || isNaN(parsedPrice) || parsedPrice < 0)`. If validation fails, it returns `400 Bad Request` with a JSON message.
7. **Creation & Array Push**: If valid, a new product object is constructed with a unique ID (`String(Date.now())`), name, numeric price, and quantity. It is pushed onto the in-memory `products` array.
8. **Response Sent**: The server returns `res.status(201).json(newProduct)`, delivering the created product object back to the client as JSON.

---

**8. What is CRUD? Map each operation to the HTTP method and route you used in your API.**

*Your answer:*
CRUD stands for **Create, Read, Update, Delete** — the four basic functions of persistent storage and RESTful APIs.

| CRUD Operation | HTTP Method | Route | Description |
|---|---|---|---|
| **Create** | `POST` | `/products` | Adds a new product to the array |
| **Read (All)** | `GET` | `/products` | Fetches all products (or filtered by `?name=`) |
| **Read (One)** | `GET` | `/products/:id` | Fetches a single product by ID |
| **Update** | `PUT` | `/products/:id` | Updates an existing product's details by ID |
| **Delete** | `DELETE` | `/products/:id` | Removes a product from the array by ID |

---

**9. How does your API respond when something goes wrong — for example, when a product with a given ID does not exist?**

*Your answer:*
When a product ID does not exist (e.g., `GET /products/999` or `DELETE /products/999`), our server route handler attempts to find the item in the `products` array using `.find()` or `.findIndex()`.

When no match is found, the handler returns immediately with an explicit `404 Not Found` HTTP status code and a JSON object describing the error:
```json
{
  "message": "Product not found"
}
```
Similarly, for invalid data payloads, it returns `400 Bad Request` with `{"message": "Valid product name and non-negative price are required"}`. This ensures the API always returns structured, human-readable JSON error responses rather than HTML stack traces or silent failures.

---

## Frontend & Integration

**10. What is CORS, and what problem does it solve? What would you see in your browser if it wasn't configured on your server?**

*Your answer:*
**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that restricts web pages from making HTTP requests to a different domain, port, or protocol (origin) than the one serving the web page, unless the target server explicitly permits it via HTTP headers (such as `Access-Control-Allow-Origin`).

**Problem solved**: CORS prevents malicious websites from silently reading sensitive data or sending unauthorized requests to another server using your browser session.

**What you see without CORS**: If CORS is not enabled on Express (`cors()`), the browser's JavaScript engine will block the fetch call from `http://localhost:5173` to `http://localhost:3000`. In the browser console, an explicit red CORS error appears:
`Access to fetch at 'http://localhost:3000/products' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

---

**11. Where does your React app fetch data from your API? Walk through what `useEffect` is doing in that code, and why the fetch isn't just called directly in the component body.**

*Your answer:*
Our React app fetches data inside `src/App.jsx` within a `fetchProducts` function triggered by `useEffect`.

```javascript
useEffect(() => {
  fetchProducts();
}, [fetchProducts]);
```

**What `useEffect` is doing**: `useEffect` runs side effects after React has mounted and rendered the DOM elements. By passing an empty/stable dependency array, React executes `fetchProducts()` exactly once when the component initially mounts on screen.

**Why not call fetch directly in the component body?**  
If `fetch()` were placed directly in the body of the component, every time the fetch completed and updated state via `setProducts()`, React would trigger a re-render. Re-rendering executes the component function again, which would call `fetch()` again, setting state again, creating an **infinite re-render loop** that freezes the browser and floods the API server with requests.

---

**12. Where is your API's base URL defined, and why did you put it there instead of hardcoding it in every fetch call?**

*Your answer:*
Our API base URL is defined in `client/.env` as:
`VITE_API_URL=http://localhost:3000`

In `src/App.jsx`, it is imported as:
`const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';`

**Why put it in `.env`?**
1. **Single Source of Truth**: If the backend port changes (e.g. from 3000 to 4000 or a production domain), we only change one value in `.env` instead of searching and editing every fetch call across multiple files.
2. **Environment Flexibility**: Allows seamless switching between development (`localhost`), staging, and production servers without modifying code.

---

**13. Pick one action in your app — for example, deleting a product. Walk through the full round trip: what happens from the moment the user clicks the button, to the request reaching your server, to the screen updating with the new list.**

*Your answer:*
Let's walk through **Deleting a Product**:
1. **User Action**: The user clicks the "Delete" button on a product card (e.g., ID `"2"`).
2. **Click Handler**: `ProductCard` fires `onDelete("2")`, which calls `handleDeleteProduct("2")` in `App.jsx`.
3. **Confirmation**: A browser confirmation prompt asks the user to confirm. Upon clicking OK, JavaScript executes an HTTP fetch:
   `fetch("http://localhost:3000/products/2", { method: "DELETE" })`.
4. **Network & Server Processing**: The request arrives at the Express server on port 3000. Express routes it to `DELETE /products/:id` in `routes/products.js`.
5. **Array Mutation**: The server handler finds index `1` in the `products` array and performs `products.splice(index, 1)`.
6. **Server Response**: The server sends back HTTP `200 OK` with JSON `{"message": "Product deleted successfully", "product": {...}}`.
7. **Client State Update**: Upon receiving `response.ok`, `App.jsx` calls React state updater:
   `setProducts(prev => prev.filter(p => p.id !== "2"))`.
8. **UI Render**: React notices state changed, re-renders the component tree, and the deleted card smoothly disappears from the screen without reloading the browser page.

---

**14. What does your app show the user while data is loading, and what does it show if the fetch fails (e.g. the server isn't running)? Why does that matter?**

*Your answer:*
- **While Loading**: The app displays a `LoadingBanner` component featuring a rotating CSS loading spinner and the message *"Fetching products from Express API..."*.
- **If Fetch Fails**: If the Express server is turned off or unreachable, `fetch()` throws a network error caught by the `catch` block. The app sets `error` state and renders `ErrorBanner`, showing a clear red warning card with *"Server Connection Error: Unable to connect to Express backend server..."* alongside a **"Retry Connection"** button.

**Why does this matter?**  
Without loading and error states, the user would be left looking at a blank or frozen screen with no feedback, leading them to assume the web app is broken. Clear loading and error feedback builds user trust and makes the application resilient.

---

**15. After you add, edit, or delete a product, your on-screen list updates without a page refresh. Explain how — what actually causes React to re-render with the new data?**

*Your answer:*
In React, component re-rendering is driven by **state updates** via `useState` setter functions (e.g., `setProducts`).

When an action succeeds (for example, adding a new product via `POST /products`):
1. The API responds with the newly created product JSON object.
2. We call `setProducts(prevProducts => [...prevProducts, newProduct])`.
3. Calling `setProducts()` signals React that the component's state has changed.
4. React calculates the difference (reconciles the Virtual DOM) and updates only the DOM elements affected by the change.
5. The list updates instantly on screen without executing a browser window refresh (`window.location.reload()`).

---

**16. What was the hardest part of connecting your React app to your Express API, and what did you do to get past it?**

*Your answer:*
The trickiest part was ensuring seamless state synchronization between client UI state and server in-memory state during edit operations (`PUT`), while handling edge cases like invalid form inputs and API network failures gracefully.

To overcome this:
1. I tested each endpoint thoroughly using the `requests.http` REST Client file first to confirm status codes (200, 200 vs 201, 400, 404) and response payloads before writing frontend fetch code.
2. I built a reusable modal component (`ProductFormModal`) that accepts `initialData` for editing or `null` for adding, ensuring client-side input validation happens before submitting the fetch request, while displaying server validation errors directly inside the form modal if the API returns `400 Bad Request`.

---

## AI Process

Only complete this section if you rated yourself **2 or higher** on the AI Code Contribution Scale above. If you rated 0 or 1, write "N/A" under each question.

**17. If you used AI to generate any code, how did you break the work into steps or prompts? Give one example of a specific prompt you used, rather than a single "build the whole app" request.**

*Your answer:*
Rather than asking AI to generate the entire repository in one prompt, I broke the project down into small, targeted phases following the Assessment Brief:

1. **Step 1 (Backend API Routes)**: "Create an Express router in `routes/products.js` supporting GET, GET by ID, POST, PUT, and DELETE for an in-memory array of products with input validation for name, price, and quantity."
2. **Step 2 (REST Client)**: "Generate a `requests.http` test file covering all 5 product routes including positive and negative 400/404 cases."
3. **Step 3 (React Client & State Sync)**: "Create a React App component using Vite that fetches `/products` on load, manages loading/error states, and updates local state in-memory after POST, PUT, and DELETE operations."

---

**18. Describe one specific thing an AI tool generated that you changed, corrected, or rejected — and why.**

*Your answer:*
*Specific example*: Initially, the AI generated the `POST /products` and `PUT /products/:id` server route logic using loose validation (`if (!price)`), which incorrectly rejected products with a price of `0` because `0` evaluates to falsy in JavaScript (`!0 === true`).

*My correction*: I modified the route handlers in `server/routes/products.js` to parse numbers explicitly using `Number(price)` and check `isNaN(parsedPrice) || parsedPrice < 0`. This allowed legitimate zero-price or promotional products while properly blocking negative prices or non-numeric strings.

---

**19. Describe one real bug or error you ran into while building this. How did you actually figure out what was wrong, beyond pasting the error back into the chat?**

*Your answer:*
*Bug description*: When attempting to create the Vite React client app using PowerShell on Windows, running `npx create-vite` failed with a `PSSecurityException` error stating script execution was disabled on the system.

*How I diagnosed & fixed it*:
1. I read the terminal output error message: `File C:\Program Files\nodejs\npx.ps1 cannot be loaded because running scripts is disabled on this system.`
2. I recognized that Windows PowerShell execution policy blocks `.ps1` wrapper scripts by default.
3. Instead of changing global Windows policies, I bypassed the shell limitation by invoking `cmd /c "npx -y create-vite@latest . --template react"` directly, allowing npm/npx to scaffold the client application cleanly without execution policy restriction.

---

**20. Pick one route (backend) or one component (frontend) that AI helped generate. Without looking back at your AI chat history, explain what it does and why it works, in your own words.**

*Your answer:*
**Component Explained**: `ProductFormModal.jsx` (Frontend Component)

**What it does**:  
`ProductFormModal` is a dual-purpose modal dialog used for both adding a new product and editing an existing one. It receives props: `isOpen`, `onClose`, `onSubmit`, `initialData`, `isSubmitting`, and `serverError`.

**Why it works**:
1. It uses `useEffect` to reset or populate form inputs whenever `initialData` or `isOpen` changes. If `initialData` exists (Edit Mode), fields populate with that product's name, price, and quantity. If `null` (Add Mode), fields reset to blank defaults.
2. When the user clicks "Submit", `handleSubmit` prevents default browser page submission (`e.preventDefault()`), performs client-side validation checks (ensuring non-empty string, valid number for price, quantity >= 1), and then invokes `onSubmit(formData)`.
3. If the server returns a `400 Bad Request`, `serverError` is rendered inside an error banner inside the modal, keeping the user informed without closing the modal unexpectedly.
