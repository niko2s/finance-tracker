package db

import (
	"database/sql"
)

func CreateSchema(db *sql.DB) error {
	createTableSQL := `
	 CREATE TABLE IF NOT EXISTS users (
		 id SERIAL PRIMARY KEY,
		 username VARCHAR(50) NOT NULL,
		 email VARCHAR(100) NOT NULL,
		 password VARCHAR(20) NOT NULL,
		 balance INTEGER DEFAULT 0
	 );`

	_, err := db.Exec(createTableSQL)
	if err != nil {
		return err
	}

	createExpenseCategoriesTableSQL := `
	CREATE TABLE IF NOT EXISTS expense_categories (
		id SERIAL PRIMARY KEY,
		name VARCHAR(50) NOT NULL,
		total FLOAT NOT NULL,
		user_id INTEGER,
		FOREIGN KEY (user_id) REFERENCES users (id)
	);`

	_, err = db.Exec(createExpenseCategoriesTableSQL)
	if err != nil {
		return err
	}

	createExpensesTableSQL := `
	CREATE TABLE IF NOT EXISTS expenses (
		id SERIAL PRIMARY KEY,
		title VARCHAR(100) NOT NULL,
		value FLOAT NOT NULL,
		expense_category_id INTEGER,
		FOREIGN KEY (expense_category_id) REFERENCES expense_categories (id)
	);`

	_, err = db.Exec(createExpensesTableSQL)
	return err
}
