# S89 - SalitaPress API

## Credentials

**Admin User**

- email: admin@mail.com
- password: admin1234

**Regular User**

- email: vivi@mail.com
- password: vivi1234

## Endpoints

**User**

- [POST] /users/register - Register user
- [POST] /users/login - Login user
- [GET] /users/details - get user details

**Posts**

- [POST] /blogs/ - Add Blog Post
- [GET] /blogs/ - Get All Blog Post
- [GET] /blogs/:id - Get Specific post
- [DELETE] /blogs/delete/:id - Delete Specific Post
- [PATCH] /blogs/:id/comment - Add blog comment
