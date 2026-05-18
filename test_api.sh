TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/signin -H "Content-Type: application/json" -d '{"email":"alex.minhotosantos@gmail.com","password":"admin"}' | jq -r .token)
echo "Token: $TOKEN"
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/categorias | jq
