package models

import (
	"database/sql"
)

type User struct {
	ID       string `json:"id"`
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Balance  int    `json:"balance"`
}

func CreateSchema(db *sql.DB) error {
	// SQL statement to create a "users" table
	createTableSQL := `
	 CREATE TABLE IF NOT EXISTS users (
		 id SERIAL PRIMARY KEY,
		 username VARCHAR(50) NOT NULL,
		 email VARCHAR(100) NOT NULL,
		 password VARCHAR(20) NOT NULL,
		 balance INTEGER DEFAULT 0
	 );`

	// Execute the SQL statement to create the table
	_, err := db.Exec(createTableSQL)
	return err
}
