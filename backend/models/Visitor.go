package models

type Visitor struct {
	IP      string `json:"ip" gorethink:"ip"`
	OS      string `json:"os" gorethink:"os"`
	Browser string `json:"browser" gorethink:"browser"`
	Time    string `json:"time" gorethink:"time"`
}
