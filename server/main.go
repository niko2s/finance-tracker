package main

import (
	"finance-tracker-server/db"
	"finance-tracker-server/handlers"
	"finance-tracker-server/models"
	"finance-tracker-server/repository"

	//"finance-tracker-server/services"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load(".env")
	database := db.ConnectToDb()
	err := models.CreateSchema(database)

	userRepo := repository.NewUserRepository(database)

	if err != nil {
		log.Fatal("Error at CreateSchema: " + err.Error())
	}

	router := gin.Default()

	router.POST("/addUser", func(c *gin.Context) {
		handlers.AddUser(c, userRepo)
	})

	router.GET("/users", func(c *gin.Context) {
		handlers.GetUsers(c, userRepo)
	})

	router.Run(":8080")
}
