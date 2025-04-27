package service

import (
	"context"
	"testing"

	calculatorpb "calculator/backend/api/calculator"
)

func TestCalculatorService_Add(t *testing.T) {
	service := NewCalculatorService()
	ctx := context.Background()

	tests := []struct {
		name     string
		a        float64
		b        float64
		expected float64
	}{
		{"正数加法", 5.0, 3.0, 8.0},
		{"负数加法", -5.0, -3.0, -8.0},
		{"混合加法", -5.0, 8.0, 3.0},
		{"零值加法", 0.0, 5.0, 5.0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := &calculatorpb.CalculateRequest{
				A: tt.a,
				B: tt.b,
			}
			resp, err := service.Add(ctx, req)
			if err != nil {
				t.Fatalf("Add() 错误 = %v", err)
			}
			if resp.Result != tt.expected {
				t.Errorf("Add() = %v, 期望 %v", resp.Result, tt.expected)
			}
		})
	}
}

func TestCalculatorService_Subtract(t *testing.T) {
	service := NewCalculatorService()
	ctx := context.Background()

	tests := []struct {
		name     string
		a        float64
		b        float64
		expected float64
	}{
		{"正数减法", 5.0, 3.0, 2.0},
		{"负数减法", -5.0, -3.0, -2.0},
		{"混合减法", -5.0, 3.0, -8.0},
		{"零值减法", 0.0, 5.0, -5.0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := &calculatorpb.CalculateRequest{
				A: tt.a,
				B: tt.b,
			}
			resp, err := service.Subtract(ctx, req)
			if err != nil {
				t.Fatalf("Subtract() 错误 = %v", err)
			}
			if resp.Result != tt.expected {
				t.Errorf("Subtract() = %v, 期望 %v", resp.Result, tt.expected)
			}
		})
	}
}

func TestCalculatorService_Multiply(t *testing.T) {
	service := NewCalculatorService()
	ctx := context.Background()

	tests := []struct {
		name     string
		a        float64
		b        float64
		expected float64
	}{
		{"正数乘法", 5.0, 3.0, 15.0},
		{"负数乘法", -5.0, -3.0, 15.0},
		{"混合乘法", -5.0, 3.0, -15.0},
		{"零值乘法", 0.0, 5.0, 0.0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := &calculatorpb.CalculateRequest{
				A: tt.a,
				B: tt.b,
			}
			resp, err := service.Multiply(ctx, req)
			if err != nil {
				t.Fatalf("Multiply() 错误 = %v", err)
			}
			if resp.Result != tt.expected {
				t.Errorf("Multiply() = %v, 期望 %v", resp.Result, tt.expected)
			}
		})
	}
}

func TestCalculatorService_Divide(t *testing.T) {
	service := NewCalculatorService()
	ctx := context.Background()

	tests := []struct {
		name      string
		a         float64
		b         float64
		expected  float64
		expectErr bool
	}{
		{"正数除法", 6.0, 3.0, 2.0, false},
		{"负数除法", -6.0, -3.0, 2.0, false},
		{"混合除法", -6.0, 3.0, -2.0, false},
		{"除以零", 5.0, 0.0, 0.0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := &calculatorpb.CalculateRequest{
				A: tt.a,
				B: tt.b,
			}
			resp, err := service.Divide(ctx, req)
			if tt.expectErr {
				if err == nil {
					t.Fatalf("Divide() 期望错误，但得到 nil")
				}
				if resp.Error == "" {
					t.Errorf("Divide() 期望错误消息，但得到空字符串")
				}
			} else {
				if err != nil {
					t.Fatalf("Divide() 错误 = %v", err)
				}
				if resp.Result != tt.expected {
					t.Errorf("Divide() = %v, 期望 %v", resp.Result, tt.expected)
				}
			}
		})
	}
}
