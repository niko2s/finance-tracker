package helpers

import (
	"github.com/gin-gonic/gin"
	"time"
)

const rfc3339Format = "2006-01-02T15:04:05Z"

func GetUserIdFromContext(c *gin.Context) int {
	userId, _ := c.Get("userId")
	intId := userId.(int)
	return intId
}

func FormatTimeTimeToPostgres(time_ time.Time) string {
	return time_.Format(rfc3339Format)
}

func FormatTimePostgresToTimeTime(time_ string) (time.Time, error) {
	timeString, error_ := time.Parse(rfc3339Format, time_)
	return timeString, error_
}
