package models

type Expense struct {
	Id                int     `json:"id" db:"id"`
	Title             string  `json:"title" db:"title"`
	Value             float64 `json:"value" db:"value"`
	ExpenseCategoryId int     `json:"expense_category_id" db:"expense_category_id"`
}
