package services

import (
	"finance-tracker-server/helpers"
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"golang.org/x/crypto/bcrypt"
	"log"
)

func LogIn(ur *repository.UserRepository, rtr *repository.RefreshTokenRepository, email string, password string) (string, string, int, error) {
	user, err := ur.GetUserByEmail(email)
	if err != nil {
		return "", "", 0, helpers.WrapUnauthorizedError("invalid email or password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", "", 0, helpers.WrapUnauthorizedError("invalid email or password")
	}

	authTokenStr, err := helpers.CreateAuthToken(user.ID)

	if err != nil {
		log.Printf("Error creating auth token: %v", err)
		return "", "", 0, helpers.ErrInternal
	}
	refreshTokenStr, refreshExp, err := helpers.CreateRefreshToken(user.ID)

	if err != nil {
		log.Printf("Error creating refresh token: %v", err)
		return "", "", 0, helpers.ErrInternal
	}

	//save refreshToken on successful creation in DB

	refreshExpFormatted := helpers.FormatTimeTimeToPostgres(refreshExp)
	refreshToken := models.RefreshToken{
		UserId:     user.ID,
		TokenValue: refreshTokenStr,
		ExpiresAt:  refreshExpFormatted,
	}
	err = rtr.AddNewRefreshToken(refreshToken)
	if err != nil {
		log.Printf("Error saving refresh token: %v", err)
		return "", "", 0, helpers.ErrInternal
	}

	return authTokenStr, refreshTokenStr, user.ID, err
}

func AddUser(ur *repository.UserRepository, newUser models.User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)

		return helpers.ErrInternal
	}

	newUser.Password = string(hashedPassword)

	err = ur.AddUser(newUser)
	if err != nil {
		log.Printf("Error adding new user: %v", err)
		return helpers.ErrInternal
	}
	return nil
}

func GetUserById(ur *repository.UserRepository, userId int) (models.User, error) {
	user, err := ur.GetUserById(userId)
	if err != nil {
		log.Printf("Error get user by id: %v", err)
		return models.User{}, helpers.ErrInternal
	}
	return user, nil
}
