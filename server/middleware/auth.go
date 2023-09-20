package middleware

import (
	"finance-tracker-server/services"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"os"
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

		token, err := jwt.Parse(authCookie.Value, func(token *jwt.Token) (interface{}, error) {
			// Don't forget to validate the alg is what you expect:
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			id := claims["user"].(float64)

			// refresh auth token in cookies every successful request
			newTokenString, err := services.CreateToken(int(id))
			if err != nil {
				fmt.Println(err) //log error here, but request still 200
			} else {
				http.SetCookie(c.Writer, &http.Cookie{
					Name:     "Authorization",
					Value:    newTokenString,
					Path:     "/",
					MaxAge:   600, //10min, change to one var here and in services.CreateToken
					Secure:   false,
					HttpOnly: true,
				})
			}

			c.Next()
		} else {
			invalidAbort(c, err)
		}

	}
}
