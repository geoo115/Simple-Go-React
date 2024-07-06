package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

// Student represents a student record
type Student struct {
	Name  string `json:"name"`
	Klass string `json:"klass"`
	Grade string `json:"grade"`
}

func main() {

	// Serve static files from the 'static' dir
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	// Serve image files from the 'assets' dir
	assets := http.FileServer(http.Dir("./assets"))
	http.Handle("/assets/", http.StripPrefix("/assets/", assets))

	connStr := "user=postgres password=mimi123 dbname=testschdb host=localhost port=5432 sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// Create table if not exists
	if err := createTable(db); err != nil {
		panic(err)
	}

	fmt.Println("Server start listening on http://localhost:8000")

	// Function Handlers for CRUD operations
	r := mux.NewRouter()
	r.HandleFunc("/insert", insertHandler(db)).Methods("POST")
	r.HandleFunc("/read", readHandler(db)).Methods("GET")
	r.HandleFunc("/update/{name}", UpdateHandler(db)).Methods("PUT")
	r.HandleFunc("/delete/{name}", DeleteHandler(db)).Methods("DELETE")

	// CORS setup
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Start Server on port 8000
	handler := c.Handler(r)
	http.ListenAndServe(":8000", handler)
}

// createTable creates the students table if it doesn't exist
func createTable(db *sql.DB) error {
	query := `
	CREATE TABLE IF NOT EXISTS students (
		id SERIAL PRIMARY KEY,
		name VARCHAR(50),
		klass VARCHAR(50),
		grade VARCHAR(2)
	);`
	_, err := db.Exec(query)
	return err
}

// insertHandler handles the insertion of a new student record
func insertHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var student Student
		if err := json.NewDecoder(r.Body).Decode(&student); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		query := "INSERT INTO students (name, klass, grade) VALUES ($1, $2, $3)"
		_, err := db.Exec(query, student.Name, student.Klass, student.Grade)
		if err != nil {
			log.Printf("Error executing insert query: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

// readHandler handles reading student records
func readHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT name, klass, grade FROM students")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var students []Student
		for rows.Next() {
			var student Student
			if err := rows.Scan(&student.Name, &student.Klass, &student.Grade); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			students = append(students, student)
		}
		if err := json.NewEncoder(w).Encode(students); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

// UpdateHandler handles updating an existing student record
func UpdateHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extract 'name' parameter from URL
		vars := mux.Vars(r)
		name := vars["name"]

		var student Student
		if err := json.NewDecoder(r.Body).Decode(&student); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		query := "UPDATE students SET name=$1, klass=$2, grade=$3 WHERE name=$4"
		_, err := db.Exec(query, student.Name, student.Klass, student.Grade, name)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

// DeleteHandler handles deleting a student record
func DeleteHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		name := mux.Vars(r)["name"]

		query := "DELETE FROM students WHERE name = $1"
		_, err := db.Exec(query, name)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
