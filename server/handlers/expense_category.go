package handlers

import (
	"finance-tracker-server/helpers"
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"finance-tracker-server/services"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func AddExpenseCategory(c *gin.Context, ecr *repository.ExpenseCategoryRepository) {
	var newExpenseCategory models.ExpenseCategory

	if err := c.ShouldBindJSON(&newExpenseCategory); err != nil {
		log.Fatal(err)
	}

	userId := helpers.GetUserIdFromContext(c)

	if userId != newExpenseCategory.UserId {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not allowed to add expense category to other user"})
		return
	}

	err := services.AddExpenseCategory(ecr, newExpenseCategory)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User added!"})
}

func GetExpenseCategories(c *gin.Context, ecr *repository.ExpenseCategoryRepository) {
	userId := helpers.GetUserIdFromContext(c)
	categories, err := services.GetAllExpenseCategoriesByUserId(userId, ecr)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch expense categories"})
		return
	}

	c.JSON(http.StatusOK, categories)
}

//func GetUsers(c *gin.Context, ur *repository.UserRepository) {
//	users, err := services.GetUsers(ur)
//	if err != nil {
//		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
//		return
//	}
//
//	c.JSON(http.StatusOK, users)
//}
