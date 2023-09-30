package handlers

import (
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

	err := services.AddExpenseCategory(ecr, newExpenseCategory)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert user"})
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{"message": "User added!"})
}
