# GET request from fake route
GET http://localhost:8080/no-such-route

# 1.1 Response
# ############
HTTP/1.1 404

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "not found"
