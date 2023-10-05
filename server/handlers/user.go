package handlers

import (
	"finance-tracker-server/helpers"
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"finance-tracker-server/services"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"time"
)

func LogIn(c *gin.Context, ur *repository.UserRepository, rtr *repository.RefreshTokenRepository) {
	var login models.Login

	if err := c.ShouldBindJSON(&login); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email and password required"})
		return
	}

	authToken, refreshToken, id, err := services.LogIn(ur, rtr, login.Email, login.Password)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	authTime, refreshTime := helpers.GetAuthAndRefreshTime()

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "Authorization",
		Value:    authToken,
		Path:     "/",
		MaxAge:   int(authTime / time.Second),
		Secure:   false, //should be True when deployed
		HttpOnly: true,
	})

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "Refresh",
		Value:    refreshToken,
		Path:     "/", //cookie only added in requests to this path
		MaxAge:   int(refreshTime / time.Second),
		Secure:   false, //should be True when deployed
		HttpOnly: true,
	})

	c.JSON(http.StatusOK, id)
}

func AddUser(c *gin.Context, ur *repository.UserRepository) {
	var newUser models.User

	if err := c.ShouldBindJSON(&newUser); err != nil {
		log.Fatal(err)
	}

	//check if username&email unique
	//no @ in username

	err := services.AddUser(ur, newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert user"})
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{"message": "User added!"})
}

func GetUser(c *gin.Context, ur *repository.UserRepository) {
	userId := helpers.GetUserIdFromContext(c)
	user, err := services.GetUserById(ur, userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func GetUsers(c *gin.Context, ur *repository.UserRepository) {
	users, err := services.GetUsers(ur)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, users)
}
