package services

import (
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"log"
)

func AddUser(ur *repository.UserRepository, newUser models.User) error {
	err := ur.AddUser(newUser)
	if err != nil {
		log.Fatal(err)
	}
	return err
}

func GetUser(ur *repository.UserRepository) ([]models.User, error) {
	users, err := ur.GetAllUsers()
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	return users, nil
}
