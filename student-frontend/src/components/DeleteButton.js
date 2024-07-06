import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteButton = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');

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

  const handleDelete = async () => {
    if (!selectedStudent) {
      alert('Please select a student to delete');
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/delete/${selectedStudent}`);
      alert('Student record deleted successfully!');
      const updatedResponse = await axios.get('http://localhost:8000/read');
      setStudents(updatedResponse.data);
    } catch (error) {
      console.error('Error deleting student record:', error);
      alert('Error deleting student record!');
    }
  };

  return (
    <div>
      <h2>Delete Student Record</h2>
      <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
        <option value="">Select Student</option>
        {students.map((student, index) => (
          <option key={index} value={student.name}>
            {student.name}
          </option>
        ))}
      </select>
      <br />
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DeleteButton;
