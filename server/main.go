package main

import (
	"finance-tracker-server/db"
	"finance-tracker-server/handlers"
	"finance-tracker-server/middleware"
	"finance-tracker-server/repository"
	"github.com/gin-gonic/gin"

	"github.com/gin-contrib/cors"
	"github.com/joho/godotenv"
	//"finance-tracker-server/services"
	"log"
)

func main() {
	godotenv.Load(".env")
	database := db.ConnectToDb()
	err := db.CreateSchema(database)

	userRepo := repository.NewUserRepository(database)
	expenseCategoryRepo := repository.NewExpenseCategoryRepository(database)
	expenseRepo := repository.NewExpenseRepository(database)
	expenseOverviewRepo := repository.NewExpenseOverviewRepository(database)

	if err != nil {
		log.Fatal("Error at CreateSchema: " + err.Error())
	}

	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"} // Replace with your frontend application's URL
	config.AllowCredentials = true

	router.Use(cors.New(config))

	router.POST("/login", func(c *gin.Context) {
		handlers.LogIn(c, userRepo)
	})

	router.POST("/addUser", func(c *gin.Context) {
		handlers.AddUser(c, userRepo)
	})

	auth := router.Group("/")
	auth.Use(middleware.AuthRequired())
	{
		//user
		auth.GET("/user", func(c *gin.Context) {
			handlers.GetUser(c, userRepo)
		})

		auth.GET("/users", func(c *gin.Context) {
			handlers.GetUsers(c, userRepo)
		})

		//expense categories
		auth.GET("/categories", func(c *gin.Context) {
			handlers.GetExpenseCategories(c, expenseOverviewRepo)
		})

		auth.POST("/addCategory", func(c *gin.Context) {
			handlers.AddExpenseCategory(c, expenseCategoryRepo)
		})

		//expense
		auth.POST("/expense", func(c *gin.Context) {
			handlers.AddExpense(c, expenseRepo)
		})
	}

	router.Run(":8080")
}
