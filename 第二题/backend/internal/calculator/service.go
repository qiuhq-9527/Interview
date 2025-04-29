package calculator

import (
	"context"
	"errors"
	"math"

	calculatorv1 "calculator/backend/proto/calculator/v1"

	"connectrpc.com/connect"
)

// Service implements the CalculatorService
type Service struct{}

// NewService creates a new calculator service
func NewService() *Service {
	return &Service{}
}

// Calculate implements the Calculate RPC method
func (s *Service) Calculate(
	ctx context.Context,
	req *connect.Request[calculatorv1.CalculateRequest],
) (*connect.Response[calculatorv1.CalculateResponse], error) {
	// Get request data
	firstOperand := req.Msg.FirstOperand
	secondOperand := req.Msg.SecondOperand
	operation := req.Msg.Operation

	// Initialize response
	res := &calculatorv1.CalculateResponse{}

	// Perform calculation based on operation
	switch operation {
	case calculatorv1.Operation_OPERATION_ADD:
		res.Result = firstOperand + secondOperand
	case calculatorv1.Operation_OPERATION_SUBTRACT:
		res.Result = firstOperand - secondOperand
	case calculatorv1.Operation_OPERATION_MULTIPLY:
		res.Result = firstOperand * secondOperand
	case calculatorv1.Operation_OPERATION_DIVIDE:
		// Check for division by zero
		if secondOperand == 0 {
			res.Error = "division by zero"
			// Return a well-formed response with error message
			return connect.NewResponse(res), nil
		}
		res.Result = firstOperand / secondOperand
	default:
		return nil, connect.NewError(
			connect.CodeInvalidArgument,
			errors.New("unsupported operation"),
		)
	}

	// Check for special cases like infinity or NaN
	if math.IsInf(res.Result, 0) {
		res.Error = "result is infinite"
	} else if math.IsNaN(res.Result) {
		res.Error = "result is not a number"
	}

	return connect.NewResponse(res), nil
} 