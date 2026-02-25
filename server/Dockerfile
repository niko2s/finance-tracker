# Build stage
FROM golang:1.21-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o main .

# Production stage
FROM scratch
WORKDIR /app
COPY --from=build /app/main .
USER 65532:65532
EXPOSE 8080
CMD ["./main"]
