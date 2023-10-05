package middleware

import (
	"finance-tracker-server/helpers"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func invalidAbort(c *gin.Context, err error) {
	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization token"})
	c.Abort()
	fmt.Println(err)
}

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {

		authCookie, err := c.Request.Cookie("Authorization")
		if err != nil {
			invalidAbort(c, err)
			return
		}

		userId, err := helpers.ValidateToken(authCookie.Value, true)

		if err != nil {
			invalidAbort(c, err)
			return
		}

		c.Set("userId", userId)
		c.Next()
	}
}
