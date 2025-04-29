package main

import (
	"context"
	"log"
	"net/http"

	calculatorv1 "calculator/backend/api/calculatorv1"
	calculatorv1connect "calculator/backend/api/calculatorv1/calculatorv1connect"

	"connectrpc.com/connect"
)

func main() {
	client := calculatorv1connect.NewCalculatorServiceClient(
		http.DefaultClient,
		"http://localhost:8080",
	)

	// Test addition
	addReq := connect.NewRequest(&calculatorv1.CalculateRequest{
		FirstOperand:  10,
		SecondOperand: 20,
		Operation:     calculatorv1.Operation_OPERATION_ADD,
	})
	addRes, err := client.Calculate(context.Background(), addReq)
	if err != nil {
		log.Fatalf("Addition failed: %v", err)
	}
	log.Printf("10 + 20 = %f", addRes.Msg.Result)

	// Test division
	divReq := connect.NewRequest(&calculatorv1.CalculateRequest{
		FirstOperand:  10,
		SecondOperand: 0,
		Operation:     calculatorv1.Operation_OPERATION_DIVIDE,
	})
	divRes, err := client.Calculate(context.Background(), divReq)
	if err != nil {
		log.Fatalf("Division failed: %v", err)
	}
	if divRes.Msg.Error != "" {
		log.Printf("Division by zero error: %s", divRes.Msg.Error)
	} else {
		log.Printf("10 / 0 = %f", divRes.Msg.Result)
	}

	log.Println("All tests completed successfully!")
} 