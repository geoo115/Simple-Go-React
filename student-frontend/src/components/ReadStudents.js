import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReadStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/read');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div>
      <h2>Students List</h2>
      <ul>
        {students.map((student, index) => (
          <li key={index}>
            Name: {student.name}, Class: {student.klass}, Grade: {student.grade}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReadStudents;
