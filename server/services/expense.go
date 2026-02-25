package services

import (
	"finance-tracker-server/helpers"
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"log"
)

func checkIfForbidden(eor *repository.ExpenseOverviewRepository, categoryId int, userId int) error {
	userIdFromCategory, err := GetUserIdByCategoryId(eor, categoryId)

	if err != nil {
		//handled in expense_category
		return err
	}

	//if try to access other users expenses
	if userIdFromCategory != userId {
		return helpers.ErrForbidden
	}

	return nil
}

func AddExpense(er *repository.ExpenseRepository, eor *repository.ExpenseOverviewRepository, newExpense models.Expense, userId int) error {
	err := checkIfForbidden(eor, newExpense.ExpenseCategoryId, userId)

	if err != nil {
		return err
	}

	if err := validateMoneyCents(newExpense.Value); err != nil {
		return err
	}
	err = er.AddNewExpense(newExpense)
	if err != nil {
		log.Printf("Error add new expense: %v", err)
	}
	return err
}

func GetExpensesByCategoryId(er *repository.ExpenseRepository, eor *repository.ExpenseOverviewRepository, categoryId int, userId int) ([]models.Expense, error) {
	err := checkIfForbidden(eor, categoryId, userId)

	if err != nil {
		return nil, err
	}

	expenses, err := er.GetAllExpensesByExpenseCategoryId(categoryId)
	if err != nil {
		log.Printf("Error get all expenses by categoryid: %v", err)
		return nil, helpers.ErrInternal
	}
	return expenses, err
}
