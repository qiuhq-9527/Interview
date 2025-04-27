package service

import (
	"context"
	"errors"

	calculatorpb "calculator/backend/api/calculator"
)

// CalculatorService 实现了计算器服务的接口
type CalculatorService struct {
	calculatorpb.UnimplementedCalculatorServiceHandler
}

// NewCalculatorService 创建一个新的计算器服务实例
func NewCalculatorService() *CalculatorService {
	return &CalculatorService{}
}

// Add 实现加法运算
func (s *CalculatorService) Add(ctx context.Context, req *calculatorpb.CalculateRequest) (*calculatorpb.CalculateResponse, error) {
	result := req.A + req.B
	return &calculatorpb.CalculateResponse{
		Result: result,
	}, nil
}

// Subtract 实现减法运算
func (s *CalculatorService) Subtract(ctx context.Context, req *calculatorpb.CalculateRequest) (*calculatorpb.CalculateResponse, error) {
	result := req.A - req.B
	return &calculatorpb.CalculateResponse{
		Result: result,
	}, nil
}

// Multiply 实现乘法运算
func (s *CalculatorService) Multiply(ctx context.Context, req *calculatorpb.CalculateRequest) (*calculatorpb.CalculateResponse, error) {
	result := req.A * req.B
	return &calculatorpb.CalculateResponse{
		Result: result,
	}, nil
}

// Divide 实现除法运算
func (s *CalculatorService) Divide(ctx context.Context, req *calculatorpb.CalculateRequest) (*calculatorpb.CalculateResponse, error) {
	if req.B == 0 {
		return &calculatorpb.CalculateResponse{
			Error: "除数不能为零",
		}, errors.New("除数不能为零")
	}
	result := req.A / req.B
	return &calculatorpb.CalculateResponse{
		Result: result,
	}, nil
}
