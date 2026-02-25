package handlers

import (
	"errors"
	"finance-tracker-server/helpers"
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"finance-tracker-server/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetDeposits(c *gin.Context, dr *repository.DepositRepository) {
	userId := helpers.GetUserIdFromContext(c)

	deposits, err := services.GetAllDepositsByUser(dr, userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, deposits)
}

func AddDeposit(c *gin.Context, dr *repository.DepositRepository) {
	var deposit models.Deposit
	err := c.BindJSON(&deposit)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to process request. Please ensure your JSON is correctly formatted."})
		return
	}
	userId := c.GetInt("userId")
	deposit.UserId = userId
	err = services.AddDeposit(dr, deposit)
	if err != nil {
		if errors.Is(err, helpers.ErrBadRequest) {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal error occured!"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deposit added successfully!"})
}

func GetSumOfDeposits(c *gin.Context, dr *repository.DepositRepository) {
	userId := c.GetInt("userId")
	sum, err := services.GetSumOfDepositsByUser(dr, userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal error occured!"})
		return
	}
	c.JSON(http.StatusOK, sum)
}
