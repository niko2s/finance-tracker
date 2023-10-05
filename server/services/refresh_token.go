package services

import (
	"errors"
	"finance-tracker-server/helpers"
	"finance-tracker-server/repository"
	"log"
	"time"
)

func CreateNewAuthFromRefreshToken(rtr *repository.RefreshTokenRepository, refreshTokenString string) (string, error) {
	refreshToken, err := rtr.GetRefreshToken(refreshTokenString)
	if err != nil {
		return "", errors.New("invalid refresh token")
	}

	refreshTokenTime, err := helpers.FormatTimePostgresToTimeTime(refreshToken.ExpiresAt)

	//check if expired, because expired refresh tokens not instantly deleted
	if err != nil || refreshTokenTime.Before(time.Now()) {
		return "", errors.New("invalid refresh token")
	}

	//refresh token valid, create new auth token
	authToken, err := helpers.CreateAuthToken(refreshToken.UserId)
	if err != nil {
		log.Printf("Error creating new auth token: %v", err)
		return "", errors.New("internal error")
	}

	return authToken, nil

}
