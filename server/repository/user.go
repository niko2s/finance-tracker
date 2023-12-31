package repository

import (
	"database/sql"
	"finance-tracker-server/models"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db}
}

func (ur *UserRepository) GetUserByEmail(email string) (models.User, error) {
	var user models.User
	err := ur.db.QueryRow(`SELECT * FROM users WHERE email=$1`, email).Scan(&user.ID, &user.Username, &user.Email, &user.Password)

	return user, err
}

func (ur *UserRepository) GetUserById(id int) (models.User, error) {
	var user models.User
	err := ur.db.QueryRow(`SELECT * FROM users WHERE id=$1`, id).Scan(&user.ID, &user.Username, &user.Email, &user.Password)

	return user, err
}

func (ur *UserRepository) GetAllUsers() ([]models.User, error) {
	rows, err := ur.db.Query(`SELECT id, username, email FROM users`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User

	for rows.Next() {
		var u models.User

		err := rows.Scan(&u.ID, &u.Username, &u.Email, &u.Password)
		if err != nil {
			return nil, err
		}

		users = append(users, u)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (ur *UserRepository) AddUser(newUser models.User) error {
	_, err := ur.db.Exec(`INSERT INTO users(username, email, password) VALUES ($1, $2, $3)`, newUser.Username, newUser.Email, newUser.Password)
	return err
}
