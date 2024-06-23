import axios from "axios";
// import toast from "react-hot-toast";

export const uploadFileToDb = async (setLoader, selectedFileData, setSelectedFileData) => {
    let uploadedFileData = "";
    setLoader && setLoader(true);
    const formData = new FormData();
    formData.append('attachment', selectedFileData);
    await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/messages/upload-file`,
        data: formData
    }).then(response => {
        uploadedFileData = response.data.response;
        console.log(uploadedFileData);
    }).catch(err => {
        console.log('UPLOAD ATTACHMENT ERROR', err.response.data);
    });
    setSelectedFileData(undefined);
    setLoader && setLoader(false);
    return uploadedFileData;
}