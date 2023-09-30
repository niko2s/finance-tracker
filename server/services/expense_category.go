package services

import (
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
)

func AddExpenseCategory(ecr *repository.ExpenseCategoryRepository, newExpenseCategory models.ExpenseCategory) error {
	err := ecr.AddNewExpenseCategory(newExpenseCategory)
	return err
}
