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

func (er *ExpenseRepository) GetAllExpensesByExpenseCategoryId(expenseCategoryId int) ([]models.Expense, error) {
	rows, err := er.db.Query(`SELECT id, title, value, expense_category_id FROM expenses WHERE expense_category_id=$1`, expenseCategoryId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var expenses []models.Expense

	for rows.Next() {
		var e models.Expense

		err := rows.Scan(&e.Id, &e.Title, &e.Value, &e.ExpenseCategoryId)
		if err != nil {
			return nil, err
		}

		expenses = append(expenses, e)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	return expenses, nil
}
