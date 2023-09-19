package handlers

import (
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"finance-tracker-server/services"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddUser(c *gin.Context, ur *repository.UserRepository) {
	var newUser models.User

	if err := c.ShouldBindJSON(&newUser); err != nil {
		log.Fatal(err)
	}

	err := services.AddUser(ur, newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert user"})
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{"message": "User added!"})
}

func GetUsers(c *gin.Context, ur *repository.UserRepository) {
	users, err := services.GetUser(ur)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, users)
}
