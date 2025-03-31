# tests/integration/post-fragments-json.hurl

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
{
  "message": "This is a fragment!"
}

# 1.1 POST Response
HTTP/1.1 201

[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragments.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.type" == "application/json"

# e2e
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

# GET Response
HTTP/1.1 200
Content-Type: application/json
[Asserts]
jsonpath "$.message" == "This is a fragment!"


