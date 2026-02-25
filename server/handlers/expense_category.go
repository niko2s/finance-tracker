package handlers

import (
	"errors"
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
		log.Printf("Error at bind: %v", err)
		c.Status(http.StatusBadRequest)
		return
	}

	userId := helpers.GetUserIdFromContext(c)

	if userId != newExpenseCategory.UserId {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not allowed to add expense category to other user"})
		return
	}

	err := services.AddExpenseCategory(ecr, newExpenseCategory)
	if err != nil {
		if errors.Is(err, helpers.ErrBadRequest) {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert category"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Category added!"})
}

func GetExpenseCategories(c *gin.Context, eor *repository.ExpenseOverviewRepository) {
	userId := helpers.GetUserIdFromContext(c)
	categories, err := services.GetAllExpenseCategoriesByUserId(userId, eor)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch expense categories"})
		return
	}

	c.JSON(http.StatusOK, categories)
}
