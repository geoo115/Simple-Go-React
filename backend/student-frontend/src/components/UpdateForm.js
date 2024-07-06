import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateForm = () => {
  const [name, setName] = useState('');
  const [klass, setKlass] = useState('');
  const [grade, setGrade] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.put(`http://localhost:8000/update/${selectedStudent}`, {
            name: name,
            klass: klass,
            grade: grade
        });
        console.log(response.data); // for debugging
        alert('Student record updated successfully!');
        const updatedResponse = await axios.get('http://localhost:8000/read');
        setStudents(updatedResponse.data);
    } catch (error) {
        console.error('Error updating student record:', error);
        alert('Error updating student record!');
    }
};



  return (
    <div>
      <h2>Update Student Record</h2>
      <form onSubmit={handleSubmit}>
        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
          <option value="">Select Student</option>
          {students.map((student, index) => (
            <option key={index} value={student.name}>
              {student.name}
            </option>
          ))}
        </select>
        <br />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input type="text" value={klass} onChange={(e) => setKlass(e.target.value)} placeholder="Class" />
        <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Grade" />
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateForm;
