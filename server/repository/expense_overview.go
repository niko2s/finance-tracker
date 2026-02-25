package repository

import (
	"database/sql"
	"finance-tracker-server/models"
)

type ExpenseOverviewRepository struct {
	db *sql.DB
}

func NewExpenseOverviewRepository(db *sql.DB) *ExpenseOverviewRepository {
	return &ExpenseOverviewRepository{db}
}

func (eor *ExpenseOverviewRepository) GetExpenseSumByUser(userId int) (int64, error) {
	var expenseSum int64
	err := eor.db.QueryRow(`SELECT COALESCE(SUM(sum_expenses), 0)::BIGINT FROM ExpenseOverview WHERE user_id=$1`, userId).Scan(&expenseSum)

	if err != nil {
		return 0, err
	}

	return expenseSum, nil
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

func (eor *ExpenseOverviewRepository) GetUserIdByCategoryId(categoryId int) (int, error) {
	row := eor.db.QueryRow(`SELECT user_id FROM expense_categories WHERE id=$1`, categoryId)

	var userId int

	err := row.Scan(&userId)
	if err != nil {
		return -1, nil
	}

	return userId, nil
}
