package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ozzadar/lazylinks/backend/config"
	"github.com/ozzadar/lazylinks/backend/db"
	"github.com/ozzadar/lazylinks/backend/router"
	"github.com/rs/cors"
)

func main() {
	//Load config
	err := config.LoadConfig()
	if err != nil {
		log.Fatal(err)
	}

	//Config used here
	//Initialize the database
	db.InitDB()

	ip, err := config.Config.GetString("default", "bind_ip")
	if err != nil {
		fmt.Println("bind_ip not defined in config; exiting.")
		return
	}
	port, err := config.Config.GetString("default", "bind_port")
	if err != nil {
		fmt.Println("bind_port not defined in config; exiting.")
		return
	}

	router := router.NewRouter()

	log.Fatal(http.ListenAndServe(ip+":"+port, cors.Default().Handler(router)))
}
