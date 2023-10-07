package repository

import (
	"database/sql"
	"finance-tracker-server/models"
)

type RefreshTokenRepository struct {
	db *sql.DB
}

func NewRefreshTokenRepository(db *sql.DB) *RefreshTokenRepository {
	return &RefreshTokenRepository{db}
}

func (rtr *RefreshTokenRepository) AddNewRefreshToken(refreshToken models.RefreshToken) error {
	_, err := rtr.db.Exec(`INSERT INTO refresh_tokens(user_id, token_value, expires_at) VALUES ($1, $2, $3)`,
		refreshToken.UserId, refreshToken.TokenValue, refreshToken.ExpiresAt)
	return err
}

func (rtr *RefreshTokenRepository) DeleteRefreshToken(tokenValue string) error {
	_, err := rtr.db.Exec(`DELETE FROM refresh_tokens WHERE token_value = $1`, tokenValue)
	return err
}

func (rtr *RefreshTokenRepository) GetRefreshToken(tokenValue string) (*models.RefreshToken, error) {
	row := rtr.db.QueryRow(`SELECT id, user_id, token_value, expires_at, created_at, revoked FROM refresh_tokens WHERE token_value = $1`, tokenValue)

	var refreshToken models.RefreshToken
	err := row.Scan(&refreshToken.Id, &refreshToken.UserId, &refreshToken.TokenValue, &refreshToken.ExpiresAt, &refreshToken.CreatedAt, &refreshToken.Revoked)
	if err != nil {
		return nil, err
	}
	return &refreshToken, nil
}

func (rtr *RefreshTokenRepository) SetRefreshTokenInvalid(tokenValue string) error {
	_, err := rtr.db.Exec(`UPDATE refresh_tokens SET revoked = true WHERE token_value = $1`, tokenValue)
	return err
}
