"use client";
import React, { useState } from "react";

type Todo = {
  id: number;
  text: string;
  category: string;
};

type Category = {
  name: string;
  todos: Todo[];
};

type Props = {};

export default function TodoApp({}: Props) {
  const [categories, setCategories] = useState<Category[]>([
    { name: "Education", todos: [] },
    { name: "Work", todos: [] },
    { name: "Shopping", todos: [] },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");

  function addTodo() {
    if (inputText.trim() !== "" && selectedCategory !== "") {
      const isExistingTodo = categories
        .find((category) => category.name === selectedCategory)
        ?.todos.some((todo) => todo.text === inputText);
      if (isExistingTodo) {
        alert("This task already exists in the selected category");
        setInputText("");
        return;
      }
      const newTodo = {
        id: Date.now(),
        text: inputText,
        category: selectedCategory,
      };
      const updatedCategories = categories.map((category) =>
        category.name === selectedCategory
          ? { ...category, todos: [...category.todos, newTodo] }
          : category
      );
      setCategories(updatedCategories);
      setInputText("");
      setSelectedCategory("");
    }
  }

  function deleteTodo(categoryName: string, todoId: number) {
    const updatedCategories = categories.map((category) =>
      category.name === categoryName
        ? {
            ...category,
            todos: category.todos.filter((todo) => todo.id !== todoId),
          }
        : category
    );
    setCategories(updatedCategories);
  }

  function editTodo(categoryName: string, todoId: number) {
    setEditMode(todoId);
    const todoToEdit = categories
      .find((category) => category.name === categoryName)
      ?.todos.find((todo) => todo.id === todoId);
    if (todoToEdit) {
      setEditedText(todoToEdit.text);
      setSelectedCategory(todoToEdit.category);
    }
  }

  function updateTodo(categoryName: string, todoId: number) {
    const updatedCategories = categories.map((category) =>
      category.name === categoryName
        ? {
            ...category,
            todos: category.todos.map((todo) =>
              todo.id === todoId ? { ...todo, text: editedText } : todo
            ),
          }
        : category
    );
    setCategories(updatedCategories);
    setEditMode(null);
    setEditedText("");
    setSelectedCategory("");
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Task Management App</h2>
      <div className="flex mb-4">
        <input
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          type="text"
          className="border-gray-300 border rounded-l px-4 py-2 w-full"
          placeholder="Add a new task..."
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border-gray-300 border rounded-r px-4 py-2"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-l hover:bg-blue-600 transition-colors duration-300 ml-2"
          onClick={addTodo}
        >
          Add
        </button>
      </div>
      {categories
        .filter((category) => category.todos.length > 0)
        .map((category) => (
          <div key={category.name} className="mb-4">
            <h3 className="text-lg font-bold mb-2">{category.name}</h3>
            <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
              {category.todos.map((todo) => (
                <li
                  className="flex items-center justify-between py-4 px-6"
                  key={todo.id}
                >
                  {editMode === todo.id ? (
                    <input
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="border-gray-300 border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span className="text-lg">{todo.text}</span>
                  )}
                  <div>
                    {editMode === todo.id ? (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 mr-2"
                        onClick={() => updateTodo(category.name, todo.id)}
                      >
                        Change
                      </button>
                    ) : (
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors duration-300 mr-2"
                        onClick={() => editTodo(category.name, todo.id)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
                      onClick={() => deleteTodo(category.name, todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}