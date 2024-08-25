
# Blog Platform API

This repository contains the source code and documentation for the Blog Platform API. This API allows users to register, authenticate, and manage blog posts. The API supports various operations such as creating, updating, and fetching blog posts.

## Table of Contents

- [Authentication](#authentication)
  - [Register](#register)
  - [Login](#login)
  - [Get User Information](#get-user-information)
- [Posts](#posts)
  - [Create or Update Blog Posts](#create-or-update-blog-posts)
  - [Markdown Editor](#markdown-editor)
- [API Testing with Postman](#api-testing-with-postman)
  - [Collection Overview](#collection-overview)
  - [How to Use the Collection](#how-to-use-the-collection)
- [API Documentation](#api-documentation)

## Authentication

### Register

- **Email**: `testuser10@gmail.com`
- **Username**: `test10`
- **Password**: `password123`

When registering a new user, the following checks are performed:
- Existing emails and usernames cannot be reused.
- Password length is validated.
- Passwords are made more secure by running a hashing algorithm with 10 rounds (more rounds increase security but slow down the hashing process). Refer to the User model for more details.

### Login

- **Requirement**: User must be registered to log in.

### Get User Information

- **Requirement**: User must be logged in to retrieve their profile information.

## Posts

### Create or Update Blog Posts

1. **New Blog Post** (without a header image):
   - Must contain a `title` and `content`.
   - If no header image is provided, its property is set to `null` by default.

2. **New Blog Post** (with a header image):
   - When a header image is provided, its upload URL is included alongside the newly created post.

3. **Update Blog Post**:
   - You can update both the content and header image.

### Markdown Editor

- Use Markdown to create, edit, and post content.
- The input is stored and rendered as plain text in the API response and the database.

**Example**:
\`\`\`markdown
## This is a heading
- This is a list item
**Bold text**
\`\`\`

## API Testing with Postman

### Collection Overview

This project includes a Postman collection for testing and documenting the API of the responsive blog. The collection provides pre-configured requests for common operations such as authentication, registration, and managing blog posts.

- **Collection Name**: Responsive Blog API
- **Description**: A collection for testing and documenting the API of a responsive blog.

The collection contains the following key endpoints:

1. **User Authentication**
   - **Login**: `POST /api/auth/login`
     - Example Request Body:
       \`\`\`json
       {
         "email": "test2@example.com",
         "password": "password123"
       }
       \`\`\`
   - **Get User Details**: `GET /api/auth/me`
   
2. **User Registration**
   - **Register**: `POST /api/auth/register`
     - Example Request Body:
       \`\`\`json
       {
         "username": "testuser3",
         "email": "test3@example.com",
         "password": "password123"
       }
       \`\`\`

3. **Blog Posts**
   - **Create a Post**: `POST /api/posts`
     - Example Request Body:
       \`\`\`json
       {
         "title": "My Documentation test runs on the Blog Post",
         "content": "This is the first content of the blog post API."
       }
       \`\`\`
   - **Update a Post**: `PUT /api/posts/{postId}`
   - **Get All Posts**: `GET /api/posts`

### How to Use the Collection

1. **Import the Collection**:
   - Download the `Responsive Blog API.postman_collection.json` file.
   - In Postman, go to `File > Import`, and select the downloaded JSON file.

2. **Set Up Environment Variables**:
   - If needed, set up environment variables in Postman for items like `baseURL`, `token`, etc.

3. **Run the Requests**:
   - Use the requests in the collection to interact with the API endpoints. Make sure to update any required fields, such as `token` for authenticated requests.

## API Documentation

For a more detailed look at the API endpoints, including parameters and example responses, visit the API documentation hosted on Postman: [API Documentation](https://documenter.getpostman.com/view/37810737/2sAXjF8EYZOA).
