package services

import "finance-tracker-server/repository"

func GetBalance(eor *repository.ExpenseOverviewRepository, dr *repository.DepositRepository, userId int) (float64, error) {
	expenses, err := eor.GetExpenseSumByUser(userId)
	if err != nil {
		return 0, err
	}

	deposits, err := dr.GetSumOfDepositsByUser(userId)
	if err != nil {
		return 0, err
	}

	return deposits - expenses, nil
}
