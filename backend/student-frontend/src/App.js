import React from 'react';
import InsertForm from './components/InsertForm';
import ReadStudents from './components/ReadStudents';
import UpdateForm from './components/UpdateForm';
import DeleteButton from './components/DeleteButton';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Student Management System</h1>
        <div className="crud-section">
          <div className="crud-section-item">
            <InsertForm />
            <ReadStudents />
          </div>
          <div className="crud-section-item">
            <UpdateForm />
            <DeleteButton />
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;
