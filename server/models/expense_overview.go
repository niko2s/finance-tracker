package models

import "database/sql"

type ExpenseOverview struct {
	UserId        int             `json:"user_id" db:"user_id"`
	CategoryId    int             `json:"category_id" db:"category_id"`
	CategoryName  string          `json:"name" db:"category_name"`
	CategoryTotal float64         `json:"total" db:"category_total"`
	ExpenseSum    sql.NullFloat64 `json:"expense_sum" db:"sum_expenses"`
}
