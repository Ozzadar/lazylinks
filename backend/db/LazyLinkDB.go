package db

import (
	"time"

	"github.com/ozzadar/lazylinks/backend/models"
	"github.com/varstr/uaparser"
	r "gopkg.in/gorethink/gorethink.v4"
)

func GetLazyLink(lazylink *models.LazyLink) error {
	rows, err := r.Table(LazyLinkTableName).GetAllByIndex("id", lazylink.ID).Run(Session)

	if err != nil {
		return err
	}

	err = rows.One(&lazylink)

	if err != nil {
		return err
	}

	return nil
}

// CreateNewLazyLink builds and creates the new lazylink using the passed in LongLink
// If the LongLink has been used previously, it returns the existing entry to avoid duplication
// it populates the provided reference with the new or existing lazylink
func CreateNewLazyLink(lazylink *models.LazyLink) error {

	var existingLinks []*models.LazyLink
	// Check if the longlink already exists
	res, err := r.Table(LazyLinkTableName).GetAllByIndex("longlink", lazylink.LongLink).Run(Session)

	if err != nil {
		return nil
	}

	err = res.All(&existingLinks)

	if err != nil {
		return nil
	}

	// If the link exists, return it instead of creating a new one
	// We enforce only 1 entry, so we can just grab the first one
	if existingLinks != nil {
		// Update the ID field with the existing ID
		lazylink.ID = existingLinks[0].ID
		// Populate the Visitors field to complete the data structure
		lazylink.Visitors = existingLinks[0].Visitors
		return nil
	}

	// Since there is no existing link, generate a new lazylink
	lazylink.ID = generateLazyLink()

	// Save it to the database
	_, err = r.Table(LazyLinkTableName).Insert(lazylink).RunWrite(Session)

	if err != nil {
		return err
	}

	// return it
	return nil
}

func UpdateLazyLink(link *models.LazyLink) error {
	_, err := r.Table(LazyLinkTableName).
		Get(link.ID).
		Update(link).
		RunWrite(Session)

	if err != nil {
		return err
	}

	return nil
}

func AddVisitorInformation(link *models.LazyLink, userAgentInfo *uaparser.UAInfo, IP string) error {
	visitors := link.Visitors

	if visitors == nil {
		visitors = []models.Visitor{}
	}

	newVisitor := models.Visitor{}

	if userAgentInfo.OS != nil {
		newVisitor.OS = userAgentInfo.OS.Name
	}
	if userAgentInfo.Browser != nil {
		newVisitor.Browser = userAgentInfo.Browser.Name
	}

	newVisitor.IP = IP
	t := time.Now()
	newVisitor.Time = t.Format("2006-01-02 15:04:05 MST")
	visitors = append(visitors, newVisitor)

	link.Visitors = visitors

	// Save the new visitor list to database
	err := UpdateLazyLink(link)

	if err != nil {
		return err
	}
	return nil
}

// generateLazyLink takes the current NumberOfLinks
// and builds the next lazylink in line.
func generateLazyLink() string {
	done := false
	lazylink := ""
	NumberOfLinks++

	leftover := NumberOfLinks - 1

	for !done {
		remainder := leftover % 36
		leftover = (leftover / 36) - 1

		lazylink = getCharacter(remainder) + lazylink

		if leftover <= -1 {
			done = true
		}
	}

	return lazylink
}

// getCharacter returns the ascii character assigned to the
// value passed in (between 0 and 35)
func getCharacter(ascii int) string {
	if ascii >= 26 && ascii <= 35 {
		difference := ascii - 26
		letter := 48 + difference
		return string(letter)
	} else if ascii >= 0 && ascii <= 25 {
		letter := 97 + ascii
		return string(letter)
	}
	return ""
}
