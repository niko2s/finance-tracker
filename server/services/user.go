package services

import (
	"errors"
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func LogIn(ur *repository.UserRepository, email string, password string) (string, int, error) {
	user, err := ur.GetUserByEmailAndPassword(email, password)
	if err != nil {
		//wrong email/password
		log.Printf("Error getting user by email and password: %v", err)
		return "", 0, errors.New("invalid email or password")
	}

	token, err := CreateToken(user.ID) // error handled in func, just forward to handler
	return token, user.ID, err
}

func CreateToken(id int) (string, error) {

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user": id,
		"exp":  jwt.NewNumericDate(time.Now().Add(10 * time.Minute)),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if err != nil {
		log.Printf("Error creating JWT signed token: %v", err)
		return "", errors.New("internal error during login")
	}
	return tokenString, nil
}

func AddUser(ur *repository.UserRepository, newUser models.User) error {
	err := ur.AddUser(newUser)
	if err != nil {
		log.Fatal(err)
	}
	return err
}

func GetUserById(ur *repository.UserRepository, userId int) (models.User, error) {
	user, err := ur.GetUserById(userId)
	if err != nil {
		log.Fatal(err)
		return models.User{}, err
	}
	return user, nil
}

func GetUsers(ur *repository.UserRepository) ([]models.User, error) {
	users, err := ur.GetAllUsers()
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	return users, nil
}
