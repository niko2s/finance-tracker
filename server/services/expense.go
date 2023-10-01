package services

import (
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"log"
)

func AddExpense(er *repository.ExpenseRepository, newExpense models.Expense) error {
	err := er.AddNewExpense(newExpense)
	if err != nil {
		log.Println(err)
	}
	return err
}

func GetExpensesByCategoryId(er *repository.ExpenseRepository, categoryId int) ([]models.Expense, error) {
	expenses, err := er.GetAllExpensesByExpenseCategoryId(categoryId)
	if err != nil {
		log.Println(err)
	}
	return expenses, err
}
