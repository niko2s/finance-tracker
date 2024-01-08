# Build stage
FROM golang:alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN GOOS=linux go build -a -o main .

# Production stage
FROM alpine:latest  
WORKDIR /root/
COPY --from=build /app/main .
CMD ["./main"]  