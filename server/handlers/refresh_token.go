package handlers

import (
	"finance-tracker-server/helpers"
	"finance-tracker-server/repository"
	"finance-tracker-server/services"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func RefreshToken(c *gin.Context, rtr *repository.RefreshTokenRepository) {
	cookie, err := c.Cookie("Refresh")

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "no refresh cookie in request"})
		return
	}
	authToken, err := services.CreateNewAuthFromRefreshToken(rtr, cookie)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	authTime, _ := helpers.GetAuthAndRefreshTime()

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "Authorization",
		Value:    authToken,
		Path:     "/",
		MaxAge:   int(authTime / time.Second),
		Secure:   false, //should be True when deployed
		HttpOnly: true,
	})

	c.JSON(http.StatusOK, gin.H{"expiry": authTime})

}
