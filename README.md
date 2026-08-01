
# Mock API

This directory contains the mock backend used for the technical assignment.

The API is powered by **json-server** and is intended to simulate a REST API for the application.

---

## Installation

Install the required dependencies:

```bash
npm install
```

---

## Running the API

Start the mock server:

```bash
npx json-server db.json --port 3001 --middlewares middleware.js
```

The API will be available at:

```
http://localhost:3001
```

---

# Available Resources

The following resources are available:

```
/users
/tasks
/notifications
```

Since this project uses **json-server**, all standard REST endpoints are automatically available.

Examples:

```
GET    /tasks
GET    /tasks/:id

POST   /tasks

PATCH  /tasks/:id

DELETE /tasks/:id
```

The same applies to the `users` and `notifications` resources.

---

# Filtering, Searching & Sorting

Examples:

```
GET /tasks?priority=high

GET /tasks?status=todo

GET /tasks?title_like=dashboard

GET /tasks?_sort=id

GET /tasks?_page=1&_per_page=20
```

You may use any filtering capabilities supported by **json-server**.

---

# Error Simulation

The mock API provides several query parameters for testing error handling.

## Internal Server Error

```
GET /tasks?error=500
```

Returns:

```
HTTP 500
```

---

## Artificial Delay

```
GET /tasks?delay=3000
```

Adds a 3-second delay before returning the response.

---

## Timeout

```
GET /tasks?timeout=true
```

The request intentionally never completes, allowing you to test client-side timeout handling.

---

# Notes

* Authentication is **not** part of this mock API.
* Focus on the frontend architecture rather than backend implementation.
* Feel free to use your preferred HTTP client (Axios, ofetch, Fetch API, etc.).
* The mock API should not be modified unless required for your own testing.
