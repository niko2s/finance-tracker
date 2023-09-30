package helpers

import "github.com/gin-gonic/gin"

func GetUserIdFromContext(c *gin.Context) int {
	userId, _ := c.Get("userId")
	intId := int(userId.(float64))
	return intId
}
