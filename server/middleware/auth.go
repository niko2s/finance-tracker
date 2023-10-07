package middleware

import (
	"errors"
	"finance-tracker-server/helpers"
	"github.com/gin-gonic/gin"
	"net/http"
)

func invalidAbort(c *gin.Context, err error) {

	var httpStatus int

	if errors.Is(err, helpers.ErrUnauthorized) {
		httpStatus = http.StatusUnauthorized
	} else {
		httpStatus = http.StatusForbidden
	}

	c.JSON(httpStatus, gin.H{"error": "Invalid authorization token"})
	c.Abort()
}

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {

		authCookie, err := c.Request.Cookie("Authorization")
		if err != nil {
			invalidAbort(c, helpers.ErrUnauthorized)
			return
		}

		userId, err := helpers.ValidateToken(authCookie.Value, true)

		if err != nil {
			invalidAbort(c, helpers.ErrForbidden)
			return
		}

		c.Set("userId", userId)
		c.Next()
	}
}
