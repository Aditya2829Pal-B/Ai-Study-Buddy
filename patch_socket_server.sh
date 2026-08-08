#!/bin/bash
sed -i 's/cors: { origin: "\*", methods: \["GET", "POST"\] }/cors: { origin: "*", methods: ["GET", "POST"] }, pingInterval: 10000, pingTimeout: 5000/g' server.ts
