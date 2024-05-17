import React, { useContext, useEffect, useState } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { WorkspaceContext } from '../../context/WorkspaceProvider';
import { toast } from 'react-hot-toast';

const TodoPage = () => {
    const { isTodoApOpen, setIsTodoApOpen, todos, setTodos } = useContext(WorkspaceContext);
    const [newTodo, setNewTodo] = useState('');
    // const [todos, setTodos] = useState([]);
    const [editTodoId, setEditTodoId] = useState(-1);
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('1');
    const [tabSelected, setTabSelected] = useState(1);

    // =======================================================================
    const calcDeadline = (deadline) => {
        let dateString;
        if (deadline) {
            const date = new Date(deadline);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            dateString = `${day}:${month}:${year}`;
        } else {
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            dateString = `${day}:${month}:${year}`;
        }
        return dateString;
    };

    const checkTodo = (todoId) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo, index) => ({
                ...todo,
                checked: index === todoId ? !todo.checked : todo.checked,
            }))
        );
    };

    const editTodo = (todoId) => {
        setNewTodo(todos[todoId].value);
        setDeadline(todos[todoId].deadline);
        setPriority(todos[todoId].priority);
        setEditTodoId(todoId);
    };

    const deleteTodo = (todoId) => {
        setTodos((prevTodos) => prevTodos.filter((todo, index) => index !== todoId));
        setEditTodoId(-1);
    };

    const sortTodos = () => {
        setTodos((prevTodos) =>
            prevTodos.slice().sort((a, b) => {
                const priorityA = a.priority || ""; // Default to an empty string if priority is undefined
                const priorityB = b.priority || "";

                const priorityComparison = priorityA.localeCompare(priorityB);

                if (priorityComparison === 0) {
                    return new Date(a.deadline) - new Date(b.deadline);
                }

                return priorityComparison;
            })
        );
    };

    const handleTodoFormSubmit = (e) => {
        e.preventDefault();
        const isEmpty = (newTodo.trim() === '' && deadline === '');

        if (deadline === '' && !isEmpty) setDeadline(calcDeadline());
        if (isEmpty) {
            toast.error("Todo's input is Empty");
            return;
        }
        // const isDuplicate = todos && todos.some((todo) => todo.value.toUpperCase() === newTodo.toUpperCase());

        // if (isDuplicate) {
        //     toast.error("This todo is Already present");
        //     return;
        // }

        if (editTodoId >= 0) {
            setTodos((prevTodos) =>
                prevTodos.map((todo, index) => ({
                    ...todo,
                    value: index === editTodoId ? newTodo : todo.value,
                    deadline: index === editTodoId ? deadline : todo.deadline,
                    priority: index === editTodoId ? priority : todo.priority,
                }))
            );
            setEditTodoId(-1);
        } else {
            const todo = {
                value: newTodo,
                deadline,
                priority,
                checked: false,
            };
            setTodos((prevTodos) => [...prevTodos, todo]);
        }

        setNewTodo('');
        setDeadline('');
    }

    // =======================================================================
    const TodoForm = () => {
        return (
            <form className='flex flex-col justify-center gap-2 mt-5 mb-3 mx-16'
                onSubmit={handleTodoFormSubmit}>
                <input type="text"
                    placeholder='Enter new todo..'
                    className='input focus-within:outline-none'
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                />
                <div className='flex justify-between'>
                    <div className='flex gap-1'>
                        <select id="priority" name="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className='select select-sm'
                        >
                            <option value="1">High</option>
                            <option value="2">Medium</option>
                            <option value="3">Low</option>
                        </select>
                        <input type="date" id="deadline"
                            className='input input-sm'
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>
                    <div className='flex justify-around ml-[2%] gap-1 w-1/2'>
                        <button type="submit"
                            className={`btn btn-outline btn-sm w-[45%]
                            ${editTodoId >= 0 && 'bg-blue-400 text-black'}`}
                            onClick={handleTodoFormSubmit}
                        >{editTodoId >= 0 ? 'Edit' : 'Add'}
                        </button>
                        <button type="button" id="sort-todos"
                            className='btn btn-outline btn-sm w-[45%]'
                            onClick={sortTodos}
                        >Sort Todo
                        </button>
                    </div>
                </div>
            </form>
        )
    }

    const ToDoListShow = () => {
        let filteredTodos = todos;
        if (tabSelected !== 1) {
            filteredTodos = todos.filter(todo => {
                return tabSelected === 2 ? todo.checked : !todo.checked
            })
        }
        return (
            filteredTodos && filteredTodos.map((todo, index) => (<div
                className="bg-orange-700 m-[2%] flex flex-col gap-2 items-start rounded-md p-2"
                key={index}>
                <div className='flex justify-center items-center gap-2'>
                    <button
                        onClick={() => checkTodo(index)}
                        className={`text-xl hover:scale-125 px-2
                                ${todo.checked ? 'text-green-500' : 'text-slate-400'}
                            `}
                    ><FaCheckCircle /></button>
                    <p className={todo.checked ? 'line-through' : ''} onClick={() => checkTodo(index)}>
                        {todo.value}
                    </p>
                </div>
                <div className='flex justify-start items-center gap-2 mx-2 w-full'>
                    <div className="tooltip tooltip-bottom label text-xs rounded-lg bg-slate-800 w-[15%] flex justify-center"
                        data-tip="Priority"
                    >{todo.priority === '1' ? 'High' : todo.priority === '2' ? 'Medium' : 'Low'}</div>
                    <div className="tooltip tooltip-bottom label text-xs rounded-lg bg-slate-800 w-[15%] flex justify-center"
                        data-tip="Deadline"
                    >{calcDeadline(todo.deadline)}</div>
                    {tabSelected === 1 && (
                        <button
                            onClick={() => editTodo(index)}
                            className='text-xl hover:scale-125 pl-4 pr-2'
                        ><FaEdit /></button>
                    )}
                    <button
                        onClick={() => deleteTodo(index)}
                        className='text-xl hover:scale-125  pr-4'
                    ><MdDeleteForever /></button>
                </div>
            </div>
            ))
        )
    }

    return (
        <div className={`absolute min-w-[80vw] bg-[#153448] z-50 top-0 h-[95%] 
        mt-2 mb-4 transition-all ${isTodoApOpen ? 'left-0' : '-left-[100%]'}`}>
            <div className='flex mx-[10%] h-[10%] items-center pb-[3%] pt-[5%] justify-start border-b-2'>
                <IoArrowBackSharp
                    onClick={() => setIsTodoApOpen(false)}
                    className='cursor-pointer text-xl hover:scale-150 hover:text-slate-300 transition-all rounded-lg'
                />
                <h1 className='w-full text-center text-2xl pr-2'>
                    TodoList
                </h1>
            </div>
            <div>
                {TodoForm()}
            </div>
            <div role="tablist" className="tabs tabs-bordered h-[5%] mx-5">
                <a role="tab"
                    className={`tab ${tabSelected === 1 && 'tab-active'}`}
                    onClick={() => setTabSelected(1)}
                >All Todos</a>
                <a role="tab"
                    className={`tab ${tabSelected === 2 && 'tab-active'}`}
                    onClick={() => setTabSelected(2)}
                >Completed</a>
                <a role="tab"
                    className={`tab ${tabSelected === 3 && 'tab-active'}`}
                    onClick={() => setTabSelected(3)}
                >Pending</a>
            </div>
            <div className='h-[70%] overflow-y-scroll'>
                {ToDoListShow()}
            </div>
        </div>

        // MdDeleteForever CiEdit CiCircleCheck
    )
}

export default TodoPage