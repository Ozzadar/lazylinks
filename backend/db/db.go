package db

import (
	"github.com/klouds/kDaemon/logging"
	"github.com/ozzadar/lazylinks/backend/config"
	r "gopkg.in/gorethink/gorethink.v4"
)

var (
	// Session variable for accessing DB
	Session *r.Session

	// LazyLinkTableName used to access table
	LazyLinkTableName = "lazylinks"

	NumberOfLinks int
)

// InitDB initializes the database and its tables if needed and creates the session
func InitDB() {

	// Get the database information from the configuration
	rethinkdbhost, err := config.Config.GetString("default", "rethinkdb_host")
	if err != nil {
		logging.Log("Problem with config file! (rethinkdb_host)")
	}

	rethinkdbport, err := config.Config.GetString("default", "rethinkdb_port")
	if err != nil {
		logging.Log("Problem with config file! (rethinkdb_port)")
	}

	rethinkdbname, err := config.Config.GetString("default", "rethinkdb_dbname")

	if err != nil {
		logging.Log("Problem with config file! (rethinkdb_dbname)")
	}

	// Setup the database if it doesn't exist yet
	setupDatabase(rethinkdbhost, rethinkdbport, rethinkdbname)

	// Initiate the permanent session
	session, err := r.Connect(r.ConnectOpts{
		Address:  rethinkdbhost + ":" + rethinkdbport,
		Database: rethinkdbname,
	})

	Session = session
}

func setupDatabase(host string, port string, dbname string) {
	session, err := r.Connect(r.ConnectOpts{
		Address: host + ":" + port,
	})

	if err != nil {
		logging.Log("rethinkdb not found at given address: ", host, ":", port)
		panic(true)
	}

	_, err = r.DBCreate(dbname).RunWrite(session)

	if err != nil {
		logging.Log("Unable to create DB, probably already exists.")
	}

	//Create LazyLink table
	_, err = r.DB(dbname).TableCreate(LazyLinkTableName).RunWrite(session)

	if err != nil {
		logging.Log("Failed in creating users table")
	}

	// Add a secondary index to LazyLink table
	_, err = r.DB(dbname).Table(LazyLinkTableName).IndexCreate("longlink").Run(session)
	if err != nil {
		logging.Log(err)
	}

	// Get total number of lazylinks
	cursor, err := r.DB(dbname).Table(LazyLinkTableName).Count().Run(session)

	if err != nil {
		logging.Log("Failed to get lazy link count")
	} else {
		cursor.One(&NumberOfLinks)
		cursor.Close()
	}

}
