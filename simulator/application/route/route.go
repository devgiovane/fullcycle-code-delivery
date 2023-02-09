package route

import (
	"bufio"
	"encoding/json"
	"errors"
	"os"
	"strconv"
	"strings"
)

type Position struct {
	Lat float64 `json:"lat"`
	Long float64 `json:"long"`
}

type Route struct {
	ID string `json:"route_id"`
	ClientID string `json:"client_id"`
	Positions []Position `json:"positions"`
}

type ExportRoute struct {
	ID string `json:"route_id"`
	ClientId string `json:"client_id"`
	Position []float64 `json:"position"`
	Finished bool `json:"finished"`
}

func NewRoute() *Route {
	return &Route{}
}

func (r *Route) LoadPositions() error {
	if r.ID == "" {
		return errors.New("invalid route id")
	}
	f, err := os.Open("destinations/" + r.ID + ".txt")
	if err != nil {
		return err
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		data := strings.Split(scanner.Text(), ",")
		lat, err := strconv.ParseFloat(data[0], 64)
		if err != nil {
			return err
		}
		long, err := strconv.ParseFloat(data[1], 64)
		if err != nil {
			return err
		}
		r.Positions = append(r.Positions, Position{
			Lat: lat, Long: long,
		})
	}
	return nil
}

func (r *Route) ExportJsonPositions() ([]string, error) {
	var route ExportRoute
	var result []string
	total := len(r.Positions)
	for k, v := range r.Positions {
		route.ID = r.ID
		route.ClientId = r.ClientID
		route.Position = []float64{
			v.Lat, v.Long,
		}
		route.Finished = false
		if k == total - 1 {
			 route.Finished = true
		}
		data, err := json.Marshal(route)
		if err != nil {
			return nil, err
		}
		result = append(result, string(data))
	}
	return result, nil
}
