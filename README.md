# Patient REST API (Node.js + Express + MySQL)

A beginner-friendly REST API for managing patient records. It uses **Express** for HTTP routes, **MySQL** for storage, and **Docker Compose** to run the API and database together.

GitHub: [phuchuydoan/ApiNodejsGenerating](https://github.com/phuchuydoan/ApiNodejsGenerating)

---

## What you can do

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/` | Health check |
| `GET` | `/patients` | List patients |
| `GET` | `/patients/:id` | Get one patient |
| `POST` | `/patients` | Create a patient |
| `PUT` | `/patients/:id` | Update a patient |
| `DELETE` | `/patients/:id` | Delete a patient |

---

## Project structure

```text
nodejsapi/
├── src/
│   ├── index.js                 # starts the Express server
│   ├── route/patient.route.js   # URL routes
│   ├── controller/controller.js # request handlers (CRUD)
│   ├── query/patient.query.js   # SQL statements
│   ├── config/mysql.config.js   # MySQL connection pool
│   ├── domain/response.js       # JSON response shape
│   └── util/logger.js           # logging
├── dbinit/init.sql              # creates the patients table
├── Dockerfile                   # builds the API image
├── docker-compose.yml           # API + MySQL containers
├── .env.example                 # copy this to .env
└── package.json
```

How a request flows:

```text
Client  →  route  →  controller  →  MySQL  →  JSON response
```

---

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer (22 recommended)
- [MySQL](https://dev.mysql.com/) 8+ **or** [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- npm (comes with Node.js)

---

## 1. Run locally (Node + your own MySQL)

### Create the database

```bash
mysql -u root < dbinit/init.sql
```

### Configure environment

```bash
cp .env.example .env
```

Edit `.env` if your MySQL user or password is different:

```env
SERVER_PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=patientsdb
DB_CONNECTION_LIMIT=10
```

### Install and start

```bash
npm install
npm run start:dev
```

Open [http://localhost:3000](http://localhost:3000). You should see:

```json
{
  "statusCode": 200,
  "httpStatus": "OK",
  "message": "Patient API, v1.0.0 - All Systems Go"
}
```

---

## 2. Run with Docker (easiest)

Docker starts **MySQL** and the **API** for you.

```bash
cd /path/to/this/project
docker compose up -d --build
```

If your CLI is older, use:

```bash
docker-compose up -d --build
```

Check that both containers are up:

```bash
docker compose ps
curl http://127.0.0.1:3000/
```

Useful commands:

```bash
docker compose logs -f          # follow logs
docker compose down             # stop containers
```

The API is on port **3000**. MySQL is published on host port **3360** (container still uses 3306).

---

## Example requests

Create a patient:

```bash
curl -X POST http://localhost:3000/patients \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "address": "123 Main St",
    "diagnosis": "Flu",
    "phone": "555-0100",
    "image_url": "https://example.com/jane.jpg"
  }'
```

List patients:

```bash
curl http://localhost:3000/patients
```

Get / update / delete one patient (`1` is the id):

```bash
curl http://localhost:3000/patients/1

curl -X PUT http://localhost:3000/patients/1 \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "address": "123 Main St",
    "diagnosis": "Recovered",
    "phone": "555-0100",
    "image_url": "https://example.com/jane.jpg"
  }'

curl -X DELETE http://localhost:3000/patients/1
```

You can also use [Postman](https://www.postman.com/) with the same URLs.

---

## Deploy on a cloud VM (AWS EC2)

On the server:

```bash
cd ~/nodejsapi
docker compose up -d --build
```

The app listens on port **3000**. For Postman or a browser on your laptop to reach it:

1. Use the instance **Elastic IP** (not an old public IP that changed).
2. Open **inbound TCP 3000** on the EC2 security group.
3. Call `http://YOUR_ELASTIC_IP:3000/`.

SSH example:

```bash
ssh -i your-key.pem ec2-user@YOUR_ELASTIC_IP
```

---

## Push this project to GitHub

The GitHub repo is currently empty. From your project folder:

```bash
cd /path/to/nodejsapi
git init
git add .
git commit -m "Initial commit: Patient REST API with Express, MySQL, and Docker"
git branch -M main
git remote add origin https://github.com/phuchuydoan/ApiNodejsGenerating.git
git push -u origin main
```

`.gitignore` already excludes `node_modules` and `.env` so secrets and installed packages are not uploaded.

---

## Tech stack

- Node.js + Express 5
- MySQL 8 (`mysql2` driver)
- Docker + Docker Compose
- Pino for logs

Built as a learning project: routes, controllers, SQL, environment variables, and containers.
