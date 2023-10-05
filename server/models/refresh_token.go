package models

type RefreshToken struct {
	Id         int    `json:"id" db:"id"`
	UserId     int    `json:"user_id" db:"user_id"`
	TokenValue string `json:"token_value" db:"token_value"`
	ExpiresAt  string `json:"expires_at" db:"expires_at"`
	CreatedAt  string `json:"created_at" db:"created_at"`
	Revoked    bool   `json:"revoked" db:"revoked"`
}
