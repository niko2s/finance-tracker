package models

import "database/sql"

type ExpenseOverview struct {
	UserId        int           `json:"user_id" db:"user_id"`
	CategoryId    int           `json:"category_id" db:"category_id"`
	CategoryName  string        `json:"name" db:"category_name"`
	CategoryTotal int64         `json:"total" db:"category_total"`
	ExpenseSum    sql.NullInt64 `json:"expense_sum" db:"sum_expenses"`
}
