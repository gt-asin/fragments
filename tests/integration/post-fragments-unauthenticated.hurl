# tests/integration/post-fragments-unauthenticated.hurl

# Un-Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: text/image
[BasicAuth]
user1@email.com:password123
`This is a fragment!`

# Reponse
HTTP/1.1 401
