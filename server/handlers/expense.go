package handlers

import (
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"finance-tracker-server/services"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strconv"
)

func AddExpense(c *gin.Context, er *repository.ExpenseRepository) {
	var newExpense models.Expense

	if err := c.ShouldBindJSON(&newExpense); err != nil {

		log.Fatal("Error at bind: ", err)
	}

	err := services.AddExpense(er, newExpense)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert expense"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Expense added!"})
}

func GetExpenses(c *gin.Context, er *repository.ExpenseRepository) {
	id := c.Param("id")

	intId, err := strconv.Atoi(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter not an integer"})
		return
	}

	expenses, err := services.GetExpensesByCategoryId(er, intId)

	c.JSON(http.StatusOK, expenses)
}
