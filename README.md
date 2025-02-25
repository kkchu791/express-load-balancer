# Express Load Balancer in Round Robin Fashion

To install:
$ cd lb-server; npm install; cd ..
$ cd server1; npm install; cd ..
$ cd server2; npm install; cd ..
$ cd server3; npm install; cd ..

To run:
docker-compose up --build

To test:
curl -X POST http://localhost:4200/lb \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello from Client"}'


