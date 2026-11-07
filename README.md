# Personal Knowledge Base / Notes API

A REST API for a second-brain or personal note-taking application. It uses Node.js, Express, MongoDB Atlas and Mongoose and supports validated CRUD operations, pagination, sorting, text search and category filtering.

## Technology

- Node.js and Express
- MongoDB Atlas and Mongoose
- dotenv
- Joi request validation
- Render deployment

## Local setup

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```env
   PORT=5000
   MONGO_URI=my_mongodb_connection_string
   ```

4. Start the API:

   ```bash
   npm start
   ```

5. Open `http://localhost:5000/`.

## Live deployment
 
```text
https://personal-notes-api-bavd.onrender.com/
```

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/notes` | Create a note |
| GET | `/api/notes` | List notes |
| GET | `/api/notes/:id` | Get a note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

### Create a note

```bash
POST http://localhost:5000/api/notes
```

```json
{
  "title": "Backend Architecture Notes",
  "content": "Mastering pagination, sorting, and index-backed text search.",
  "category": "Work",
  "tags": ["nodejs", "mongodb"]
}
```

### Update a note

A partial update is accepted:

```json
{
  "title": "Updated Backend Architecture Notes"
}
```

## Query examples

### Pagination

```text
GET /api/notes?page=1&limit=10
GET /api/notes?page=2&limit=10
```

### Sorting

```text
GET /api/notes?sort=-createdAt
GET /api/notes?sort=createdAt
GET /api/notes?sort=title
```

A minus prefix selects descending order.

### Text search

```text
GET /api/notes?q=meeting
GET /api/notes?search=meeting
```

The text index searches both `title` and `content`.

### Category filtering

```text
GET /api/notes?category=Work
```

Category matching is case-insensitive.

Pagination, sorting, search and category filtering can also be combined:

```text
GET /api/notes?page=1&limit=5&sort=-createdAt&q=meeting&category=Work
```

## Responses

Successful list requests include:

```json
{
  "success": true,
  "count": 2,
  "pagination": {
    "totalItems": 5,
    "currentPage": 1,
    "totalPages": 3,
    "limit": 2
  },
  "data": []
}
```

Typical HTTP statuses are `200`, `201`, `400`, `404` and `500`. Errors are returned as JSON:

```json
{
  "success": false,
  "message": "Note not found"
}
```

## Local test evidence

Run the complete local API suite and generate the evidence screenshots with:

```powershell
npm start
npm run test:evidence
```

The server must remain running while the screenshot command executes. The generated evidence is in [`evidence/screenshots/`](./evidence/screenshots/) and covers:

1. [Create note](./evidence/screenshots/01-post-create.png)
2. [Retrieve all notes](./evidence/screenshots/02-get-all.png)
3. [Pagination](./evidence/screenshots/03-pagination.png)
4. [Newest-first sorting](./evidence/screenshots/04-sort-newest-first.png)
5. [Text search](./evidence/screenshots/05-search-meeting.png)
6. [Work category filter](./evidence/screenshots/06-category-work.png)
7. [Retrieve one note](./evidence/screenshots/07-get-one.png)
8. [Update note](./evidence/screenshots/08-put-update.png)
9. [Delete note](./evidence/screenshots/09-delete.png)

## Render deployment

1. Push the repository to GitHub.
2. Create a Render Web Service connected to the repository.
3. Build command: `npm install`.
4. Start command: `npm (run) start`.
5. Add the environment variable `MONGO_URI` with the Atlas connection string.
6. Add `NODE_VERSION` if the selected Render runtime needs an explicit version.
7. Deploy and verify the Render health/root URL and all API endpoints.
