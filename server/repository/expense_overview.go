package repository

import (
	"database/sql"
	"finance-tracker-server/models"
)

type ExpenseOverviewRepository struct {
	db *sql.DB
}

func (eor *ExpenseOverviewRepository) GetAllExpenseCategoriesByUserId(userId int) ([]models.ExpenseOverview, error) {
	rows, err := eor.db.Query(`SELECT user_id, category_id, category_name, category_total, sum_expenses FROM ExpenseOverview WHERE user_id=$1`, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var expenseOverviews []models.ExpenseOverview

	for rows.Next() {
		var eo models.ExpenseOverview

		err := rows.Scan(&eo.UserId, &eo.CategoryId, &eo.CategoryName, &eo.CategoryTotal, &eo.ExpenseSum)
		if err != nil {
			return nil, err
		}

		expenseOverviews = append(expenseOverviews, eo)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return expenseOverviews, nil
}

func NewExpenseOverviewRepository(db *sql.DB) *ExpenseOverviewRepository {
	return &ExpenseOverviewRepository{db}
}
