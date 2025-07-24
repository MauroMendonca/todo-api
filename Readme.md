
# 📋 Todo API

A simple RESTful API for task management using **Node.js** + **Express** + **MongoDB Atlas** + **JSON Web Token (JWT)**.

## 📦 Features

- Create tasks with:
  - Title
  - Priority (low, medium, high)
  - Categories (tags)
  - Planned completion date
- List all tasks
- Update tasks
- Delete tasks

## 🚀 How to run the project

1. Clone the repository:

```bash
git clone https://github.com/MauroMendonca/todo-api.git
cd todo-api
```

2. Install dependencies:

```bash
npm install
```

3. Configure .evn file:

Create a `.env` file in the root of the project and configure the MongoDB connection URL:

```bash
MONGODB_URI=mongodb+srv://<USUARIO>:<SENHA>@<CLUSTER>.mongodb.net/todo-db?retryWrites=true&w=majority
PORT=3000
```


4. Start the server:

```bash
node index.js
```

The server will be available at:  
`http://localhost:3000`

## 🔐 Authentication

Authentication is based on JWT. The user must register and log in to obtain a token. This token must be sent in the `Authorization` header on protected routes.

### 🔐 Rotas de Autenticação

| Method | Route            | Description |
|--------|------------------|-------------|
| POST    | `/auth/register`| List all tasks |
| POST   | `/auth/login`    | Create a new task |
| GET    | `/auth/me`       | Returns logged-in user information (protected route).|

## 🛠️ Endpoints

| Method | Route          | Description |
|--------|----------------|-------------|
| GET    | `/tasks`        | List all tasks |
| POST   | `/tasks`        | Create a new task |
| PUT    | `/tasks/:id`    | Update a task |
| DELETE | `/tasks/:id`    | Delete a task |

#### ✅ Query Parameters (optional):
| Parameter | Type   | Description                                |
|------------|--------|--------------------------------------------|
| `tags`     | string | Filter by one or more tags (comma-separated or repeated) |
| `priority` | string | Filter by priority (`low`, `medium`, `high`) |
| `date`     | date   | Filter by date (format: `YYYY-MM-DD`)     |

---
### 🔥 Examples:

- ✅ Get all tasks:
```http
GET /tasks
```

- ✅ Filter by one tag:
```http
GET /tasks?tags=work
```

- ✅ Filter by multiple tags (two valid ways):
```http
GET /tasks?tags=work,study
```
or
```http
GET /tasks?tags=work&tags=study
```

- ✅ Filter by priority:
```http
GET /tasks?priority=high
```

- ✅ Filter by date (YYYY-MM-DD):
```http
GET /tasks?date=2025-06-30
```

- ✅ Combine multiple filters:
```http
GET /tasks?tags=work,study&priority=medium&date=2025-06-30
```

- ✅ Request with Token
```http
GET /tasks HTTP/1.1
Host: localhost:3000
Authorization: Bearer seu_token_jwt_aqui
```

### 🔧 Example Response:
```json
[
  {
    "_id": "665f4b1e9b7e2a1f4e3b6789",
    "title": "Finish project",
    "description": "Complete the backend API",
    "tags": ["work", "backend"],
    "priority": "high",
    "date": "2025-06-30T00:00:00.000Z",
    "createdAt": "2025-06-25T14:23:45.123Z",
    "__v": 0
  }
]
```

### ⚠️ Notes:
- When filtering by `tags`, you can:
  - Use a comma-separated list (`tags=work,study`).
  - Or repeat the parameter (`tags=work&tags=study`).
- The date filter returns tasks scheduled for the specific day (`YYYY-MM-DD`), from midnight to midnight.


## ✍️  Example of creating a task (`POST /tasks`)

```json
{
  "title": "Finish studying Node.js",
  "priority": "high",
  "tags": ["study", "backend"],
  "date": "2025-04-28T18:00:00Z"
}
```

## ⚡ Technologies used

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [dotenv](https://npmjs.com/package/dotenv)
- [MongoDB Atlas](https://mongodb.com/)
- [JSON Web Token (JWT)](https://www.jwt.io/)

## 📚 Future improvements

- Sort tasks by date
- Task pagination

## 📝 License

This project is licensed under the MIT License.

---

**Made with 💻 by [Mauro Mendonça]**
