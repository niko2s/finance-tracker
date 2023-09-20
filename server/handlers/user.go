package handlers

import (
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"finance-tracker-server/services"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LogIn(c *gin.Context, ur *repository.UserRepository) {
	var login models.Login

	if err := c.ShouldBindJSON(&login); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, email and password required"})
		return
	}

	token, err := services.LogIn(ur, login.Email, login.Password)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "Authorization",
		Value:    token,
		Path:     "/",
		Secure:   false,
		HttpOnly: true,
	})

	c.JSON(http.StatusOK, token)
}

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
