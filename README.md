# Express Load Balancer in Round Robin Fashion

To run:
docker-compose up --build

To test:
curl -X POST http://localhost:4200/lb \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello from Client"}'


