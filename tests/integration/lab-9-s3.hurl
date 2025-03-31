# 1. POST request
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello S3!`

# POST Response
HTTP/1.1 201

[Captures]
url: header "Location"

#2. GET request
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello S3!"

#3. DELETE request
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# DELETE Response
HTTP/1.1 200

GET {{url}}
[BasicAuth]
user1@email.com:password1

# GET Response for
HTTP/1.1 404
