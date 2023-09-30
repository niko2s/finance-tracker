package models

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Balance  int    `json:"balance"`
}
