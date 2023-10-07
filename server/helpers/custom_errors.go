package helpers

import (
	"errors"
	"fmt"
)

// Define base error types
var (
	ErrUnauthorized = errors.New("user not authorized")
	ErrForbidden    = errors.New("not allowed to access")
	ErrInternal     = errors.New("internal server error")
)

// Functions to wrap base errors with more context, if needed

func WrapUnauthorizedError(detail string) error {
	return fmt.Errorf("%w: %s", ErrUnauthorized, detail)
}

func WrapForbiddenError(detail string) error {
	return fmt.Errorf("%w: %s", ErrForbidden, detail)
}

func WrapInternalError(detail string) error {
	return fmt.Errorf("%w: %s", ErrInternal, detail)
}
