package repository

import (
	"database/sql"
	"finance-tracker-server/models"
)

type ExpenseRepository struct {
	db *sql.DB
}

func NewExpenseRepository(db *sql.DB) *ExpenseRepository {
	return &ExpenseRepository{db}
}

func (er *ExpenseRepository) AddNewExpense(expense models.Expense) error {
	_, err := er.db.Exec(`INSERT INTO expenses(title,value,expense_category_id) VALUES ($1, $2, $3)`, expense.Title, expense.Value, expense.ExpenseCategoryId)
	return err
}
