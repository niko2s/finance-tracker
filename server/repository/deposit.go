package repository

import (
	"database/sql"
	"finance-tracker-server/models"
)

type DepositRepository struct {
	db *sql.DB
}

func NewDepositRepository(db *sql.DB) *DepositRepository {
	return &DepositRepository{db}
}

func (br *DepositRepository) AddDeposit(deposit models.Deposit) error {
	_, err := br.db.Exec(`INSERT INTO deposit(title, value, user_id) VALUES ($1, $2, $3)`, deposit.Title, deposit.Value, deposit.UserId)
	return err
}

func (br *DepositRepository) GetAllDepositsByUser(userId int) ([]models.Deposit, error) {
	rows, err := br.db.Query(`SELECT id, title, value, user_id FROM deposit WHERE user_id = $1`, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var deposits []models.Deposit
	for rows.Next() {
		var deposit models.Deposit
		err = rows.Scan(&deposit.Id, &deposit.Title, &deposit.Value, &deposit.UserId)
		if err != nil {
			return nil, err
		}
		deposits = append(deposits, deposit)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return deposits, nil
}

func (br *DepositRepository) GetSumOfDepositsByUser(userId int) (int64, error) {
	row := br.db.QueryRow(`SELECT COALESCE(SUM(value), 0)::BIGINT FROM deposit WHERE user_id=$1`, userId)

	var sum int64
	err := row.Scan(&sum)
	if err != nil {
		return 0, err
	}

	return sum, nil
}
