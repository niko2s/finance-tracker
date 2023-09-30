package repository

import (
	"database/sql"
	"finance-tracker-server/models"
)

type ExpenseCategoryRepository struct {
	db *sql.DB
}

func NewExpenseCategoryRepository(db *sql.DB) *ExpenseCategoryRepository {
	return &ExpenseCategoryRepository{db}
}

func (ecr ExpenseCategoryRepository) AddNewExpenseCategory(category models.ExpenseCategory) error {
	_, err := ecr.db.Exec(`INSERT INTO expense_categories(name,total,user_id) VALUES ($1, $2, $3)`, category.Name, category.Total, category.UserId)
	return err
}

//func (ecr ExpenseCategoryRepository) addNewExpenseCategory(name string, total float32, userId int) (models.ExpenseCategory, error) {
//	var
//	return models.ExpenseCategory{}, nil
//}
