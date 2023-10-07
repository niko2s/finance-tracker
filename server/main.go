package main

import (
	"finance-tracker-server/db"
	"finance-tracker-server/handlers"
	"finance-tracker-server/middleware"
	"finance-tracker-server/repository"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"os"
)

func main() {
	godotenv.Load(".env")
	database := db.ConnectToDb()
	err := db.CreateSchema(database)

	userRepo := repository.NewUserRepository(database)
	expenseCategoryRepo := repository.NewExpenseCategoryRepository(database)
	expenseRepo := repository.NewExpenseRepository(database)
	expenseOverviewRepo := repository.NewExpenseOverviewRepository(database)
	refreshTokenRepo := repository.NewRefreshTokenRepository(database)

	if err != nil {
		log.Fatal("Error at CreateSchema: " + err.Error())
	}

	router := gin.Default()

	config := cors.DefaultConfig()
	allowedOrigins := os.Getenv("ALLOWED_ORIGIN")
	if allowedOrigins == "" {
		config.AllowOrigins = []string{"http://localhost:5173"}
	} else {
		config.AllowOrigins = []string{allowedOrigins}
	}
	config.AllowCredentials = true

	router.Use(cors.New(config))

	v1 := router.Group("/api/v1")
	{
		v1.POST("/login", func(c *gin.Context) {
			handlers.LogIn(c, userRepo, refreshTokenRepo)
		})

		v1.POST("/register", func(c *gin.Context) {
			handlers.AddUser(c, userRepo)
		})

		v1.POST("/refresh", func(c *gin.Context) {
			handlers.RefreshToken(c, refreshTokenRepo)
		})

		auth := v1.Group("/")
		auth.Use(middleware.AuthRequired())
		{

			//logout
			v1.POST("/logout", func(c *gin.Context) {
				handlers.LogOut(c, refreshTokenRepo)
			})

			//user
			auth.GET("/users/me", func(c *gin.Context) {
				handlers.GetUser(c, userRepo)
			})

			//expense categories
			auth.GET("/users/me/categories", func(c *gin.Context) {
				handlers.GetExpenseCategories(c, expenseOverviewRepo)
			})

			auth.POST("/users/me/categories", func(c *gin.Context) {
				handlers.AddExpenseCategory(c, expenseCategoryRepo)
			})

			//expense
			//all expenses for a category
			auth.GET("/users/me/categories/:id/expenses", func(c *gin.Context) {
				handlers.GetExpenses(c, expenseRepo, expenseOverviewRepo)
			})

			auth.POST("/users/me/categories/:id/expenses", func(c *gin.Context) {
				handlers.AddExpense(c, expenseRepo, expenseOverviewRepo)
			})
		}
	}

	router.Run(":8080")
}
