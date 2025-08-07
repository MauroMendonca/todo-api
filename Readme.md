
# 📋 ToDo API

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
JWT_SECRET=yourSecretSentence
```


4. Start the server:

```bash
node index.js
```

The server will be available at:  
`http://localhost:3000`

## 📚 API documentation

The API features interactive documentation automatically generated with Swagger, making it easy to view endpoints, parameters, usage examples, and responses.
You can access the full documentation using the link below:
[Swagger Documentation](https://todo-api-production-be35.up.railway.app/api-docs/)

## ⚡ Technologies used

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [dotenv](https://npmjs.com/package/dotenv)
- [MongoDB Atlas](https://mongodb.com/)
- [JSON Web Token (JWT)](https://www.jwt.io/)
- [Swagger UI](https://swagger.io/)

## 📝 License

This project is licensed under the MIT License.

---

**Made with 💻 by [Mauro Mendonça]**
