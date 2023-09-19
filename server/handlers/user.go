package handlers

import (
	"database/sql"
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"finance-tracker-server/services"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddUser(c *gin.Context, db *sql.DB) {
	var newUser models.User

	if err := c.ShouldBindJSON(&newUser); err != nil {
		log.Fatal(err)
	}

	err := services.AddUser(db, newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert user"})
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{"message": "User added!"})
}

func GetUsers(c *gin.Context, ur *repository.UserRepository) {
	users, err := ur.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, users)
}
