package handlers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/ozzadar/lazylinks/backend/db"
	"github.com/ozzadar/lazylinks/backend/models"
	"github.com/tomasen/realip"
	"github.com/varstr/uaparser"
)

// CreateLazyLink creates a lazy link with the requested information
func CreateLazyLink(w http.ResponseWriter, r *http.Request) {

	var link models.LazyLink
	b, _ := ioutil.ReadAll(r.Body)

	json.Unmarshal(b, &link)

	link.Visitors = nil

	if link.LongLink == "" {
		http.Error(w, "{\"message\":\"LongLink not provided.\"}", http.StatusBadRequest)
		return
	}

	// we should make sure that the http:// or https:// is provided; add http:// if not
	checkAndInjectHTTPPrefix(&link)

	err := db.CreateNewLazyLink(&link)

	if err != nil {
		http.Error(w, "{\"message\":\"Failed to create LazyLink.\"}", http.StatusInternalServerError)
		return
	}

	thejson, _ := json.Marshal(link)
	w.Write(thejson)
}

// GetLazyLink retrieves and returns an existing lazy link
func GetLazyLink(w http.ResponseWriter, r *http.Request) {

	link := models.LazyLink{}

	pathVars := mux.Vars(r)

	link.ID = pathVars["id"]

	err := db.GetLazyLink(&link)

	if err != nil {
		http.Error(w, "{\"message\":\"LazyLink does not exist.\"}", http.StatusNotFound)
		return
	}

	thejson, _ := json.Marshal(link)
	w.Write(thejson)

}

func VisitLazyLink(w http.ResponseWriter, r *http.Request) {
	link := models.LazyLink{}

	pathVars := mux.Vars(r)

	link.ID = pathVars["id"]

	err := db.GetLazyLink(&link)

	ua := r.Header.Get("User-Agent")
	userAgent := uaparser.Parse(ua)

	// Save visitor information
	ip := realip.FromRequest(r)
	db.AddVisitorInformation(&link, userAgent, ip)

	if err != nil {
		http.Error(w, "{\"message\":\"LazyLink does not exist.\"}", http.StatusNotFound)
		return
	}

	thejson, _ := json.Marshal(link)
	w.Write(thejson)
}

// we should make sure that the http:// or https:// is provided; add http:// if not
func checkAndInjectHTTPPrefix(link *models.LazyLink) {
	longlink := link.LongLink

	if !strings.Contains(longlink, "http://") && !strings.Contains(longlink, "https://") {
		longlink = "http://" + longlink
	}

	link.LongLink = longlink
}
