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


export const saveProject = async (token, projectName, files) => {
    await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/project`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: { userId: currentUser._id, name: projectName, files }
    }).then(response => {
        // console.log('ALl FIles save for an user -----------------------------')
        toast.success("Project saved");
        return response.data;
    }).catch(err => {
        console.log('Project save for an user', err.response.data);
        return toast.error(err.response.data.error);
    });
}

export const getAllProjects = async (token) => {
    let responseData;
    const userId = currentUser._id;
    await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/project/${userId}`,
        headers: {
            Authorization: `Bearer ${token}`
        },
    }).then((response) => {
        // console.log('ALl FIles save for an user -----------------------------')
        console.log('GetAllProjects: ', response.data);
        responseData = response.data;
    }).catch(err => {
        console.log('Project fetching for an user error: ', err.response.data);
        return toast.error(err.response.data.error);
    });
    return responseData;
}

export const deleteProject = async (token, projectId) => {
    await axios({
        method: 'DELETE',
        url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/project/${projectId}`,
        headers: {
            Authorization: `Bearer ${token}`
        },
    }).then((response) => {
        // console.log('Project Delete of an user -----------------------------')
        toast.success(response.data.message)
    }).catch(err => {
        console.log('Project deleting of an user error: ', err.response.data);
        return toast.error(err.response.data.error);
    });
}