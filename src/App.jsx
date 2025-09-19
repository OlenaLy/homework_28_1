import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './app.css';

const initialValues = {
  useritem: '',
  deadlines: '',
}

const onValidate = (formData) => {
  const errors = {};

  if (!formData.useritem.trim()) {
    errors.useritem = 'Поле не може бути порожнім'
  } else if (formData.useritem.length < 5) { errors.useritem = 'Мінімум 5 символів' }

  return errors;
}

export default function App() {
  //стан із ls
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  //зббереження у ls
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  //додавання завдання + відправка форми
  const handleSubmit = (values, { resetForm }) => {
    const newTodo = {
      id: Date.now(),
      text: values.useritem,
      deadline: values.deadlines,
    };

    setTodos((prev) => {
      const updated = [...prev, newTodo];
      localStorage.setItem('todos', JSON.stringify(updated))
      return updated;
    })
    alert(`Додано завдання: ${newTodo.text}${newTodo.deadline ? ` ⏰ ${newTodo.deadline}` : ''}`);
    resetForm();
    };
  // видалення
    const handleDelete = (id) => {
      setTodos(todos.filter(todo => todo.id !== id));
    };

  return (
    <div> 
      <h1>To do list for the day</h1>
      <Formik
        initialValues={initialValues}
        validate={onValidate}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
                <label>Що потрібно зробити:</label>
                <Field type='text' name="useritem" />
                <ErrorMessage 
                  name='useritem' 
                  component='span' 
                  className='error-label'
                />
            </div>

            <div>
              <label>Дедлайн:</label>
              <Field type='time' name="deadlines" />
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}>
               Submit
            </button>
          </Form>
        )}
      </Formik>
      {/* список завдань */}
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span>{todo.text} {todo.deadline && `⏰ ${todo.deadline}`}</span>
            <button onClick={() => handleDelete(todo.id)}> ❌ </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
