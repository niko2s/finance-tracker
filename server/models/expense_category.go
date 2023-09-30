package models

type ExpenseCategory struct {
	Id     int     `json:"id" db:"id"`
	Name   string  `json:"name" db:"name" binding:"required"`
	Total  float32 `json:"total" db:"total" binding:"required"`
	UserId int     `json:"user_id" db:"user_id" binding:"required"`
}
