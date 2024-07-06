import React, { useState } from 'react';
import axios from 'axios';

const InsertForm = () => {
  const [name, setName] = useState('');
  const [klass, setKlass] = useState('');
  const [grade, setGrade] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/insert', {
        name: name,
        klass: klass,
        grade: grade
      });
      console.log(response.data); // for debugging
      alert('Student record inserted successfully!');
    } catch (error) {
      console.error('Error inserting student record:', error);
      alert('Error inserting student record!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="text" value={klass} onChange={(e) => setKlass(e.target.value)} placeholder="Class" />
      <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Grade" />
      <button type="submit">Insert</button>
    </form>
  );
};

export default InsertForm;
