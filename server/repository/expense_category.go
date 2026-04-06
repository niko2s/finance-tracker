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

func (ecr *ExpenseCategoryRepository) AddNewExpenseCategory(category models.ExpenseCategory) error {
	_, err := ecr.db.Exec(`INSERT INTO expense_categories(name,total,user_id) VALUES ($1, $2, $3)`, category.Name, category.Total, category.UserId)
	return err
}

func (ecr *ExpenseCategoryRepository) GetAllExpenseCategoriesByUserId(userId int) ([]models.ExpenseCategory, error) {
	rows, err := ecr.db.Query(`SELECT id, name, total, user_id FROM expense_categories WHERE user_id=$1`, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var expenseCategories []models.ExpenseCategory

	for rows.Next() {
		var ec models.ExpenseCategory

		err := rows.Scan(&ec.Id, &ec.Name, &ec.Total, &ec.UserId)
		if err != nil {
			return nil, err
		}

		expenseCategories = append(expenseCategories, ec)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return expenseCategories, nil
}

func (ecr *ExpenseCategoryRepository) DeleteExpenseCategoryAndExpenses(categoryId int, userId int) (bool, error) {
	tx, err := ecr.db.Begin()
	if err != nil {
		return false, err
	}

	_, err = tx.Exec(`DELETE FROM expenses WHERE expense_category_id=$1`, categoryId)
	if err != nil {
		_ = tx.Rollback()
		return false, err
	}

	result, err := tx.Exec(
		`DELETE FROM expense_categories WHERE id=$1 AND user_id=$2`,
		categoryId,
		userId,
	)
	if err != nil {
		_ = tx.Rollback()
		return false, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		_ = tx.Rollback()
		return false, err
	}

	if rowsAffected == 0 {
		_ = tx.Rollback()
		return false, nil
	}

	if err := tx.Commit(); err != nil {
		return false, err
	}

	return true, nil
}
