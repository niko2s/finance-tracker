package services

import (
	"finance-tracker-server/helpers"
	"finance-tracker-server/models"
	"finance-tracker-server/repository"
	"log"
)

func AddDeposit(dr *repository.DepositRepository, newDeposit models.Deposit) error {
	if err := validateMoneyCents(newDeposit.Value); err != nil {
		return err
	}

	err := dr.AddDeposit(newDeposit)
	if err != nil {
		log.Printf("Error add new deposits: %v", err)
		return err
	}

	return nil
}

func GetAllDepositsByUser(dr *repository.DepositRepository, userId int) ([]models.Deposit, error) {
	deposits, err := dr.GetAllDepositsByUser(userId)
	if err != nil {
		log.Printf("Error get all deposits by user: %v", err)
		return nil, err
	}
	return deposits, nil
}

func GetSumOfDepositsByUser(dr *repository.DepositRepository, userId int) (int64, error) {
	sum, err := dr.GetSumOfDepositsByUser(userId)
	if err != nil {
		log.Printf("Error get sum of deposits by user: %v", err)
		return 0, err
	}
	return sum, nil
}

func DeleteDeposit(dr *repository.DepositRepository, depositId int, userId int) error {
	deleted, err := dr.DeleteDepositByIDAndUser(depositId, userId)
	if err != nil {
		log.Printf("Error delete deposit by user: %v", err)
		return helpers.ErrInternal
	}

	if !deleted {
		return helpers.WrapBadRequestError("deposit not found")
	}

	return nil
}
