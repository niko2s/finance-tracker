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
	"strconv"
)

func AddExpense(c *gin.Context, er *repository.ExpenseRepository, eor *repository.ExpenseOverviewRepository) {
	var newExpense models.Expense

	if err := c.ShouldBindJSON(&newExpense); err != nil {
		log.Printf("Error at bind: %v", err)
		c.Status(http.StatusBadRequest)
		return
	}

	userId := helpers.GetUserIdFromContext(c)

	err := services.AddExpense(er, eor, newExpense, userId)
	if err != nil {
		code, msg := parseError(err)
		c.JSON(code, gin.H{"error": msg})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Expense added!"})
}

func GetExpenses(c *gin.Context, er *repository.ExpenseRepository, eor *repository.ExpenseOverviewRepository) {
	categoryId := c.Param("id")
	intCategoryId, err := strconv.Atoi(categoryId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter not an integer"})
		return
	}

	userId := helpers.GetUserIdFromContext(c)

	expenses, err := services.GetExpensesByCategoryId(er, eor, intCategoryId, userId)

	if err != nil {
		code, msg := parseError(err)
		c.JSON(code, gin.H{"error": msg})
		return
	}

	c.JSON(http.StatusOK, expenses)
}

func parseError(err error) (int, string) {
	if errors.Is(err, helpers.ErrForbidden) {
		return http.StatusForbidden, err.Error()
	} else {
		return http.StatusInternalServerError, err.Error()
	}
}
