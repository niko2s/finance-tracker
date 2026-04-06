package services

import (
	"database/sql"
	"errors"
	"finance-tracker-server/helpers"
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"log"
)

func AddExpenseCategory(ecr *repository.ExpenseCategoryRepository, newExpenseCategory models.ExpenseCategory) error {
	if err := validateMoneyCents(newExpenseCategory.Total); err != nil {
		return err
	}
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
		if errors.Is(err, sql.ErrNoRows) {
			return -1, helpers.WrapBadRequestError("category not found")
		}
		return -1, helpers.ErrInternal
	}
	return userId, nil
}

func DeleteExpenseCategory(ecr *repository.ExpenseCategoryRepository, eor *repository.ExpenseOverviewRepository, categoryId int, userId int) error {
	categoryOwnerId, err := GetUserIdByCategoryId(eor, categoryId)
	if err != nil {
		return err
	}

	if categoryOwnerId != userId {
		return helpers.ErrForbidden
	}

	deleted, err := ecr.DeleteExpenseCategoryAndExpenses(categoryId, userId)
	if err != nil {
		log.Printf("Error delete expense category: %v", err)
		return helpers.ErrInternal
	}

	if !deleted {
		return helpers.WrapBadRequestError("category not found")
	}

	return nil
}
