package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"calculator/backend/internal/calculator"
	calculatorv1connect "calculator/backend/api/calculatorv1/calculatorv1connect"

	"github.com/rs/cors"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

const (
	defaultPort = "8080"
)

func main() {
	// Create a new calculator service
	calculatorService := calculator.NewService()

	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	// Create a new mux
	mux := http.NewServeMux()

	// Register the calculator service handler
	mux.Handle(calculatorv1connect.NewCalculatorServiceHandler(calculatorService))

	// Setup CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Should be restricted in production
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Accept", "Connect-Protocol-Version"},
		AllowCredentials: true,
		Debug:            true,
	})

	// Wrap the mux with CORS middleware
	handler := corsHandler.Handler(mux)

	// Prepare the HTTP server
	server := &http.Server{
		Addr:    ":" + port,
		Handler: h2c.NewHandler(handler, &http2.Server{}),
	}

	// Setup signal handling for graceful shutdown
	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)

	// Start the server in a goroutine
	go func() {
		log.Printf("Starting calculator server on port %s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Error starting server: %v", err)
		}
	}()

	// Wait for termination signal
	<-signalChan
	log.Println("Shutting down server...")
}