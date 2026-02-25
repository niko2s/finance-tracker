package services

import (
	"finance-tracker-server/helpers"
)

func validateMoneyCents(value int64) error {
	if value <= 0 {
		return helpers.WrapBadRequestError("money value must be greater than 0")
	}

	return nil
}
