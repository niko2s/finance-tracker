package services

import (
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"log"
)

func AddExpenseCategory(ecr *repository.ExpenseCategoryRepository, newExpenseCategory models.ExpenseCategory) error {
	err := ecr.AddNewExpenseCategory(newExpenseCategory)
	if err != nil {
		log.Println(err)
	}
	return err
}

func GetAllExpenseCategoriesByUserId(userId int, eor *repository.ExpenseOverviewRepository) ([]models.ExpenseOverview, error) {
	categories, err := eor.GetAllExpenseCategoriesByUserId(userId)
	if err != nil {
		log.Println(err)
	}
	return categories, err
}
