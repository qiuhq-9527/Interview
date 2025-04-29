package calculator

import (
	"context"
	"testing"

	calculatorv1 "calculator/backend/api/calculatorv1"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
)

func TestCalculatorService_Calculate(t *testing.T) {
	// 创建测试服务实例
	service := NewService()
	ctx := context.Background()

	// 定义测试用例
	tests := []struct {
		name          string
		request       *calculatorv1.CalculateRequest
		expectedValue float64
		expectedError string
	}{
		{
			name: "Addition",
			request: &calculatorv1.CalculateRequest{
				FirstOperand:  5.0,
				SecondOperand: 3.0,
				Operation:     calculatorv1.Operation_OPERATION_ADD,
			},
			expectedValue: 8.0,
			expectedError: "",
		},
		{
			name: "Subtraction",
			request: &calculatorv1.CalculateRequest{
				FirstOperand:  10.0,
				SecondOperand: 4.0,
				Operation:     calculatorv1.Operation_OPERATION_SUBTRACT,
			},
			expectedValue: 6.0,
			expectedError: "",
		},
		{
			name: "Multiplication",
			request: &calculatorv1.CalculateRequest{
				FirstOperand:  7.0,
				SecondOperand: 6.0,
				Operation:     calculatorv1.Operation_OPERATION_MULTIPLY,
			},
			expectedValue: 42.0,
			expectedError: "",
		},
		{
			name: "Division",
			request: &calculatorv1.CalculateRequest{
				FirstOperand:  20.0,
				SecondOperand: 5.0,
				Operation:     calculatorv1.Operation_OPERATION_DIVIDE,
			},
			expectedValue: 4.0,
			expectedError: "",
		},
		{
			name: "Division by zero",
			request: &calculatorv1.CalculateRequest{
				FirstOperand:  10.0,
				SecondOperand: 0.0,
				Operation:     calculatorv1.Operation_OPERATION_DIVIDE,
			},
			expectedValue: 0.0, // 值不重要，因为会有错误
			expectedError: "division by zero",
		},
		{
			name: "Unsupported operation",
			request: &calculatorv1.CalculateRequest{
				FirstOperand:  10.0,
				SecondOperand: 5.0,
				Operation:     calculatorv1.Operation_OPERATION_UNSPECIFIED,
			},
			expectedValue: 0.0, // 值不重要，因为应该返回错误
			expectedError: "unsupported operation",
		},
	}

	// 执行测试用例
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// 创建请求
			req := connect.NewRequest(tt.request)

			// 调用服务
			resp, err := service.Calculate(ctx, req)

			// 如果期望有错误消息
			if tt.expectedError != "" {
				if tt.name == "Unsupported operation" {
					// 对于不支持的操作，我们预期会返回错误
					assert.Error(t, err)
					connectErr, ok := err.(*connect.Error)
					assert.True(t, ok, "Expected connect.Error")
					assert.Contains(t, connectErr.Message(), tt.expectedError)
				} else {
					// 对于除零这样的错误，我们预期成功响应但包含错误消息
					assert.NoError(t, err)
					assert.NotNil(t, resp)
					assert.Equal(t, tt.expectedError, resp.Msg.Error)
				}
			} else {
				// 正常操作应该没有错误
				assert.NoError(t, err)
				assert.NotNil(t, resp)
				assert.Equal(t, tt.expectedValue, resp.Msg.Result)
				assert.Empty(t, resp.Msg.Error)
			}
		})
	}
}

// 测试边界值和特殊情况
func TestCalculatorService_SpecialCases(t *testing.T) {
	service := NewService()
	ctx := context.Background()

	// 测试非常大的数值（可能导致溢出）
	t.Run("Large numbers", func(t *testing.T) {
		req := connect.NewRequest(&calculatorv1.CalculateRequest{
			FirstOperand:  1e+308, // 接近最大的float64值
			SecondOperand: 1e+308,
			Operation:     calculatorv1.Operation_OPERATION_MULTIPLY,
		})

		resp, err := service.Calculate(ctx, req)
		assert.NoError(t, err)
		assert.NotNil(t, resp)
		assert.NotEmpty(t, resp.Msg.Error) // 期望有错误信息，如"result is infinite"
	})

	// 测试精度问题
	t.Run("Precision", func(t *testing.T) {
		req := connect.NewRequest(&calculatorv1.CalculateRequest{
			FirstOperand:  1.0 / 3.0, // 0.333...
			SecondOperand: 3.0,
			Operation:     calculatorv1.Operation_OPERATION_MULTIPLY,
		})

		resp, err := service.Calculate(ctx, req)
		assert.NoError(t, err)
		assert.NotNil(t, resp)
		assert.InDelta(t, 1.0, resp.Msg.Result, 1e-10) // 应该接近1.0
	})

	// 测试负数处理
	t.Run("Negative numbers", func(t *testing.T) {
		req := connect.NewRequest(&calculatorv1.CalculateRequest{
			FirstOperand:  -10.0,
			SecondOperand: -5.0,
			Operation:     calculatorv1.Operation_OPERATION_DIVIDE,
		})

		resp, err := service.Calculate(ctx, req)
		assert.NoError(t, err)
		assert.NotNil(t, resp)
		assert.Equal(t, 2.0, resp.Msg.Result)
	})
} 