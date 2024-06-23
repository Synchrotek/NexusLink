/* eslint-disable react/prop-types */
import { MdOutlineDelete } from 'react-icons/md'
import { deleteProject } from '../../utils/apiCalls/user.apicalls';
import { FaSave } from 'react-icons/fa';

const UserSavedProjectsListItem = ({
    project, token,
    setFiles,
    setUserSavedProjects,
    handleCurrentSelectedFileRefChange
}) => {
    const handledeleteProject = () => {
        deleteProject(token, project._id);
        setUserSavedProjects(prevUserSavedProjects => {
            return prevUserSavedProjects.filter(item => {
                return item._id !== project._id
            });
        })
    }

    const handlProjectImport = () => {
        const userProceeded = confirm('Are you sure to import ?');
        if (userProceeded) {
            console.log("PROJECT_FILE", project.files);
            setFiles(project.files);
            handleCurrentSelectedFileRefChange(project.files[0]);
        }
    }

    return (
        <div key={project._id}
            className="flex justify-between bg-red-700 px-2 items-center"
        >
            <FaSave />
            <button onClick={handlProjectImport}
            >{project.name}</button>
            <MdOutlineDelete
                className="cursor-pointer"
                onClick={handledeleteProject}
            />
        </div>
    )
}

export default UserSavedProjectsListItem