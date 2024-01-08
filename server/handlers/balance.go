package handlers

import (
	"finance-tracker-server/repository"
	"finance-tracker-server/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetBalance(c *gin.Context, eor *repository.ExpenseOverviewRepository, dr *repository.DepositRepository) {
	userId := c.GetInt("userId")

	balance, err := services.GetBalance(eor, dr, userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, balance)
}
