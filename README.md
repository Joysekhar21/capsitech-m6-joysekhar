# 📝 TodoApp

A full-stack Todo Application built using **ASP.NET Core Web API**, **MongoDB**, and **ReactJS** with **Tailwind CSS**. It features full user authentication using JWT and enables users to create, search, update, and delete their todos securely. The frontend manages authentication and todo state using React **Context API**.

---

## 🔧 Technologies Used

### Backend
- **ASP.NET Core Web API**: Backend RESTful API implementation.
- **MongoDB**: NoSQL database for storing user and todo data.
- **JWT (JSON Web Tokens)**: Stateless authentication for protected routes.
- **C#**: Primary programming language.
- **LINQ & MongoDB.Driver**: For querying MongoDB documents.

### Frontend
- **ReactJS**: Component-based frontend framework.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **Context API**: Built-in state management for auth and todos.


---

## 🧑‍💻 Features

- User Registration and Login
- JWT-based Protected Routes
- Create, Read, Update, Delete (CRUD) Todos
- Search Todos by Title or Description
- Pagination & Sorting (asc/desc by created time)
- Secure Password Hashing using SHA256

---

## 🔐 Authentication Routes (API)

### `POST /api/auth/register`
Registers a new user.

**Request Body:**
```json
{
  "username": "JohnDoe",
  "email": "john@example.com",
  "password": "password123"
}
````

**Response:**

* JWT token
* Basic user info

---

### `POST /api/auth/login`

Logs in an existing user.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

* JWT token
* Basic user info

---

### `GET /api/auth/me`

Returns current logged-in user info.

**Headers:**

* `Authorization: Bearer <token>`

---

## ✅ Todo Routes (API)

> All routes below require `Authorization: Bearer <token>` header.

### `GET /api/todo?page=1&sort=desc`

Returns paginated todos for logged-in user.

**Query Parameters:**

* `page`: Page number (default: 1)
* `sort`: `asc` or `desc` (default: desc)

---

### `GET /api/todo/search?query=task`

Search todos by title or description.

---

### `POST /api/todo`

Create a new todo.

**Request Body:**

```json
{
  "title": "Learn ASP.NET",
  "description": "Study MongoDB integration and token-based auth"
}
```

---

### `PUT /api/todo/{id}`

Update an existing todo.

**Request Body (partial or full):**

```json
{
  "title": "Updated title",
  "description": "Updated desc",
  "completed": true
}
```

---

### `DELETE /api/todo/{id}`

Delete a specific todo.

---

## 🌐 Frontend

* Built with **ReactJS** using functional components.
* Styled using **Tailwind CSS**.
* **Context API** used for:

  * Auth state management (login, logout)
  * Todo CRUD state
* Backend communication via **Fetch**.
* Token is stored securely (e.g. in localStorage) and attached to all protected API calls.

---

## 🛠️ Getting Started

### Backend

1. Clone the repo:

```bash
git clone https://github.com/Joysekhar21/capsitech-m6-joysekhar.git
cd TodoApp
```

2. Set up MongoDB connection string in `appsettings.json`.
3. Run the app:

```bash
dotnet run
```

### Frontend

1. Navigate to frontend directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm start
```

---

## 📁 Project Structure

```
TodoApp/
├── Controllers/
│   ├── AuthController.cs
│   └── TodoController.cs
├── Models/
│   ├── User.cs
│   └── Todo.cs
├── Services/
│   └── JwtService.cs
├── Data/
│   └── MongoDbContext.cs
└── client/
    └── [React Frontend Code with Context API]
```

---

## 🔒 Security Highlights

* Passwords are stored as **SHA256 hashes**.
* All protected routes require **JWT bearer token**.
* Token-based access ensures users can only access their own todos.

---


