package services

import (
	"database/sql"
	"finance-tracker-server/models"
)

func AddUser(db *sql.DB, newUser models.User) error {
	_, err := db.Exec(`INSERT INTO users(username, email) VALUES ($1, $2)`, newUser.Username, newUser.Email)
	return err
}
