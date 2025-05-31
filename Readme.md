
# 📋 Todo API

A simple API for task management using **Node.js** + **Express** + **MongoDB Atlas**.

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

## 🛠️ Endpoints

| Method | Route          | Description |
|--------|----------------|-------------|
| GET    | `/tasks`        | List all tasks |
| POST   | `/tasks`        | Create a new task |
| PUT    | `/tasks/:id`    | Update a task |
| DELETE | `/tasks/:id`    | Delete a task |

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

## 📚 Future improvements

- Filters on listing (by priority, tags, or date)
- Sort tasks by date
- Authentication system (user login)
- Task pagination

## 📝 License

This project is licensed under the MIT License.

---

**Made with 💻 by [Mauro Mendonça]**
