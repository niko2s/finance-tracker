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
		 password VARCHAR(60) NOT NULL
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

	createDepositTableSQL := `
	CREATE TABLE IF NOT EXISTS deposit (
		id SERIAL PRIMARY KEY,
		title VARCHAR(100),
		value FLOAT NOT NULL,
		user_id INTEGER,
		FOREIGN KEY (user_id) REFERENCES users (id)
	);`

	_, err = db.Exec(createDepositTableSQL)
	if err != nil {
		return err
	}

	createExpensesTableSQL := `
	CREATE TABLE IF NOT EXISTS expenses (
		id SERIAL PRIMARY KEY,
		title VARCHAR(100),
		value FLOAT NOT NULL,
		expense_category_id INTEGER,
		FOREIGN KEY (expense_category_id) REFERENCES expense_categories (id)
	);`

	_, err = db.Exec(createExpensesTableSQL)
	if err != nil {
		return err
	}

	createRefreshTokensTableSQL := `CREATE TABLE IF NOT EXISTS refresh_tokens (
		id SERIAL PRIMARY KEY,
		user_id INT NOT NULL,
		token_value VARCHAR(255) NOT NULL,
		expires_at TIMESTAMP NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
		revoked BOOLEAN DEFAULT FALSE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
	);`

	_, err = db.Exec(createRefreshTokensTableSQL)
	if err != nil {
		return err
	}

	createExpensesViewSQL := `
    CREATE OR REPLACE VIEW ExpenseOverview AS
    SELECT
        ec.user_id AS user_id,
        ec.id AS category_id,
        ec.name AS category_name,
        ec.total AS category_total,
        SUM(e.value) AS sum_expenses
    FROM
        expense_categories ec
    LEFT JOIN
        expenses e ON ec.id = e.expense_category_id
    GROUP BY
        ec.id, ec.name;`

	_, err = db.Exec(createExpensesViewSQL)
	return err
}
