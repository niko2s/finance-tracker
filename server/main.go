package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	// Create a Gin router
	router := gin.Default()

	// Define a route to handle the "Hello, World!" request
	router.GET("/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Hello, World!"})
	})

	// Run the server on port 8080
	router.Run(":8080")
}
