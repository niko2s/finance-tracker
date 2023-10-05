package helpers

import (
	"errors"
	"github.com/golang-jwt/jwt/v5"
	"log"
	"os"
	"time"
)

// authTime 10 min
const authTime = 10 * time.Minute

// refreshTime 7 days
const refreshTime = 7 * 24 * time.Hour

// CreateAuthToken generates a JWT authentication token for a specified user ID.
// The authentication token has a shorter expiration time, typically used for session authentication.
//
// Parameters:
//
//	userId (int): The ID of the user for whom the token is being generated.
//
// Returns:
//
//	string: The authentication token as a string.
//	error: An error object, if any error occurs during token generation.
func CreateAuthToken(userId int) (string, error) {
	authClaims := jwt.MapClaims{
		"user": userId,
		"exp":  jwt.NewNumericDate(time.Now().Add(authTime)),
	}

	authToken := jwt.NewWithClaims(jwt.SigningMethodHS256, authClaims)

	authTokenString, err := authToken.SignedString([]byte(os.Getenv("AUTH_JWT_SECRET")))
	if err != nil {
		log.Printf("Error creating JWT signed auth token: %v", err)
		return "", errors.New("internal error during login")
	}

	return authTokenString, nil
}

// CreateRefreshToken generates a JWT refresh token for a specified user ID.
// The refresh token has a longer expiration time, used to renew the authentication token
// once it expires without requiring the user to login again.
//
// Parameters:
//
//	userId (int): The ID of the user for whom the token is being generated.
//
// Returns:
//
//	string: The refresh token as a string.
//	time.Time: The expiration time of the refresh token.
//	error: An error object, if any error occurs during token generation.
func CreateRefreshToken(userId int) (string, time.Time, error) {
	refreshExp := time.Now().Add(refreshTime)
	refreshClaims := jwt.MapClaims{
		"user": userId,
		"exp":  jwt.NewNumericDate(refreshExp),
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)

	refreshTokenString, err := refreshToken.SignedString([]byte(os.Getenv("REFRESH_JWT_SECRET")))
	if err != nil {
		log.Printf("Error creating JWT signed refresh token: %v", err)
		return "", time.Time{}, errors.New("internal error during login")
	}

	return refreshTokenString, refreshExp, nil
}

// ValidateToken validates a JWT token string and returns the user ID associated with the token.
// The function supports validation of two types of tokens: authentication and refresh tokens,
// which are validated using different secret keys.
//
// Parameters:
//
//	tokenString (string): The JWT token string to be validated.
//	isAuth (boolean): The type of token being validated, either true for authentication tokens,
//	                    or false for refresh tokens.
//
// Returns:
//
//	int: The user ID associated with the token, if validation is successful.
//	error: An error object, if any error occurs during token validation.
func ValidateToken(tokenString string, isAuth bool) (int, error) {
	var secretKey string

	if isAuth {
		secretKey = os.Getenv("AUTH_JWT_SECRET")
	} else {
		secretKey = os.Getenv("REFRESH_JWT_SECRET")
	}

	token, err := jwt.ParseWithClaims(tokenString, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		log.Printf("Error parsing token: %v", err)
		return 0, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID, ok := claims["user"].(float64)
		if !ok {
			return 0, errors.New("invalid token claims")
		}
		return int(userID), nil
	}

	return 0, errors.New("invalid token")
}

func GetAuthAndRefreshTime() (time.Duration, time.Duration) {
	return authTime, refreshTime
}
