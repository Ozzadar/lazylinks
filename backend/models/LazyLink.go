package models

type LazyLink struct {
	ID       string    `json:"id,omitempty" gorethink:"id,omitempty"`
	LongLink string    `json:"longlink" gorethink:"longlink"`
	Visitors []Visitor `json:"visitors,omitempty" gorethink:"visitors,omitempty"`
}
