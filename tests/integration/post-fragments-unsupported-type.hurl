# tests/integration/post-fragments-unsupported-type.hurl

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: text/image
[BasicAuth]
user1@email.com:password1
`This is a fragment!`

# Response
HTTP/1.1 415

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" == "Incorrect or missing buffer data"

