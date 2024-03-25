## APIs

API to calculate working days
```bash
curl --location 'localhost:3000/api/calculator' \
--header 'Content-Type: application/json' \
--data '{
    "inputDateStr": "2024-03-25",
    "workingDays": 4
}'
```