import axios from "axios";
import toast from "react-hot-toast";

const currentUser = JSON.parse(localStorage.getItem('user'));

export const updateAllTodos = async (token, todos) => {
    let responseData;
    currentUser && await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/user/todos/update`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: { userId: currentUser._id, todos }
    }).then(response => {
        // console.log('ALl FIles upload to db POST -----------------------------')
        console.log(response.data);
        responseData = response.data;
    }).catch(err => {
        console.log('TODOS UPDATE DB ERROR FROM USER', err.response.data);
        toast.error(err.response.data.error);
    });
    return responseData;
}


export const getAllTodosFromDB = async (token, setTodos) => {
    let responseData;
    currentUser && await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/user/todos`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: { userId: currentUser._id }
    }).then(response => {
        // console.log('ALl FIles upload to db POST -----------------------------')
        console.log(response.data);
        responseData = response.data;
    }).catch(err => {
        console.log('TODOS FETCH DB ERROR FROM USER', err.response.data);
        toast.error(err.response.data.error);
    });
    setTodos(responseData);
}

