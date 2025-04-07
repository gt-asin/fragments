# 1. POST request
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
{
  "service": "DynamoDB"
}

# 1.1 POST Response
HTTP/1.1 201

[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragments.id"

# 1.2 GET Request
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

# 1.3 GET Response
HTTP/1.1 200

[Asserts]
jsonpath "$.fragments.id" == "{{fragment1_id}}"
jsonpath "$.fragments.type" == "application/json"

# 2. POST request
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`DynamoDB is **great**`

# 2.1 POST Response
HTTP/1.1 201

[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragments.id"

# 2.2 GET Request
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

# 2.3 GET Response
HTTP/1.1 200

# 3. DELETE Request
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

# 3.1 DELETE Response
HTTP/1.1 200

# 3.2 GET request
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

# 3.3 GET response
HTTP/1.1 404

# 4 GET /v1/fragments Request
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

# 4.1 GET Response
HTTP/1.1 200

[Asserts]
jsonpath "$.fragments" not includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

