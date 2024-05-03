import React, { useContext, useEffect, useState } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { WorkspaceContext } from '../../context/WorkspaceProvider';
import { toast } from 'react-hot-toast';

const TodoPage = () => {
    const { isTodoApOpen, setIsTodoApOpen } = useContext(WorkspaceContext);
    const [todoFormInput, setTodoFormInput] = useState('');

    useEffect(() => {
        console.log('isTodoApOpen:', isTodoApOpen);
    }, [isTodoApOpen])

    const handleTodoFormSubmit = () => {

    }
    const handleTodoFormInput = (e) => {
        setTodoFormInput(e.target.value);
    }

    const TodoForm = () => {
        return (
            <form className='flex justify-center mt-5 mb-3'
                onSubmit={handleTodoFormSubmit}>
                <input type="text"
                    placeholder='Enter new todo..'
                    className='input focus-within:outline-none w-full mx-16'
                    value={todoFormInput} onChange={handleTodoFormInput}
                />
            </form>
        )
    }

    return (
        <div className={`absolute min-w-[80vw] bg-[#153448] z-50 top-0 h-[95%] 
        mt-2 mb-4 transition-all ${isTodoApOpen ? 'left-0' : '-left-[100%]'}`}>
            <div className='flex mx-[10%] items-center pb-[3%] pt-[5%] justify-start border-b-2'>
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
        </div>
    )
}

export default TodoPage