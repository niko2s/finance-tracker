package services

import (
	"finance-tracker-server/helpers"
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"log"
)

func AddExpenseCategory(ecr *repository.ExpenseCategoryRepository, newExpenseCategory models.ExpenseCategory) error {
	err := ecr.AddNewExpenseCategory(newExpenseCategory)
	if err != nil {
		log.Printf("Error add expense category: %v", err)
	}
	return err
}

func GetAllExpenseCategoriesByUserId(userId int, eor *repository.ExpenseOverviewRepository) ([]models.ExpenseOverview, error) {
	categories, err := eor.GetAllExpenseCategoriesByUserId(userId)
	if err != nil {
		log.Printf("Error get all expense categories by userid: %v", err)
	}
	return categories, err
}

func GetUserIdByCategoryId(eor *repository.ExpenseOverviewRepository, categoryId int) (int, error) {
	userId, err := eor.GetUserIdByCategoryId(categoryId)
	if err != nil {
		log.Printf("Error get userid by categoryid: %v", err)
		return -1, helpers.ErrInternal
	}
	return userId, nil
}
