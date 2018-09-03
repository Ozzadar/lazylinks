package router

import (
	"github.com/gorilla/mux"
	"github.com/ozzadar/lazylinks/backend/router/handlers"
)

// NewRouter creates a new router with the routes set up
func NewRouter() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/lazylink", handlers.CreateLazyLink).Methods("POST")
	router.HandleFunc("/lazylink/{id}", handlers.GetLazyLink).Methods("GET")
	router.HandleFunc("/lazylink/{id}/visit", handlers.VisitLazyLink).Methods("GET")
	return router
}
