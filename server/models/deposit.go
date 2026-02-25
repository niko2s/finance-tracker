package models

type Deposit struct {
	Id     int    `json:"id" db:"id"`
	Title  string `json:"title" db:"title"`
	Value  int64  `json:"value" db:"value"`
	UserId int    `json:"user_id" db:"user_id"`
}
