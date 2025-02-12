import { getDisplayDate } from "../util/util";
import { removeTask, updateTask } from "../Redux/features/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { toast } from "react-toastify";
import { selectUser } from "../Redux/features/userSlice";
import { getEditingTask, setEditingTask } from "../Redux/features/editingSlice";

const ItemType = "TASK";

function TaskCard({ task, name, deleteTask }) {
    const [{ isDragging }, dragRef] = useDrag({
        type: ItemType,
        item: { ...task },
        collect: (monitor) => ({ isDragging: monitor.isDragging() })
    });

    const dispatch = useDispatch()

    return (
        <div className="card mb-2" ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }} key={task.id}>
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <div className={`h6 ${name === "COMPLETED" ? "text-decoration-line-through" : ""}`}>{task.name}</div>
                    <div className="dropdown">
                        <i className="bi bi-three-dots" data-bs-toggle="dropdown" style={{ cursor: "pointer" }}></i>
                        <ul className="dropdown-menu">
                            <li>
                                <button className="dropdown-item d-flex" data-bs-toggle="modal" data-bs-target="#editTaskModal" onClick={() => dispatch(setEditingTask(task))}>
                                    <i className="bi bi-pencil-square"></i>
                                    <div className="ms-3">Edit</div>
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item text-danger d-flex" onClick={() => deleteTask(task.id)}>
                                    <i className="bi bi-trash-fill "></i>
                                    <div className="ms-3">Delete</div>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                    <div className="text-muted">{task.category}</div>
                    <div className="text-muted">{getDisplayDate(task.dueDate)}</div>
                </div>
            </div>
        </div>
    );
}

function TaskBoard({ name, tasks, customClass }) {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const taskToEdit = useSelector(getEditingTask);

    const [editingTask, setEditingTask] = useState({
        id: "",
        name: "",
        description: "",
        dueDate: "",
        status: "",
        category: "",
        attachments: [],
        activities: [],
    });

    useEffect(() => {
        setEditingTask(taskToEdit);
    }, [taskToEdit]);


    const deleteTask = (id) => {
        dispatch(removeTask({ email: user.email, id }));
        toast.success("Task deleted successfully");
    };

    const [{ isOver }, dropRef] = useDrop({
        accept: ItemType,
        drop: (task) => {
            if (task.status !== name) {
                const updatedTask = { ...task, status: name };
                dispatch(updateTask({ email: user.email, ...updatedTask }));
                toast.success("Task updated successfully!");
            }
        },
        collect: (monitor) => ({ isOver: monitor.isOver() })
    });

    const getNoTaskMessage = (status) => {
        switch (status) {
            case "TO-DO":
                return "No Tasks in To-Do";
            case "IN-PROGRESS":
                return "No Tasks In Progress";
            case "COMPLETED":
                return "No Completed Tasks";
            default:
                return "No tasks available!";
        }
    };

    const taskChange = (e) => {
        const { name, value } = e.target;
        setEditingTask((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const fileChange = (e) => {
        const files = Array.from(e.target.files);
        setEditingTask((prevState) => ({
            ...prevState,
            attachments: [...prevState.attachments, ...files],
        }));
    };

    const removeFile = (index) => {
        setEditingTask((prevState) => ({
            ...prevState,
            attachments: prevState.attachments.filter((_, i) => i !== index),
        }));
    };

    const updateEditedTask = () => {
        dispatch(updateTask({ email: user.email, id: editingTask.id, ...editingTask }));
        toast.success("Task updated successfully!")
        const modal = document.getElementById('editTaskModal');
        const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
    }

    function formatTimestampToIST(timestamp) {
        const date = new Date(timestamp);
        const options = {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Asia/Kolkata',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    return (
        <div className="col-md-3 custom-task-board p-2">
            <button className={`btn btn-sm m-2 ${customClass}`}>{name}</button>
            <div className="mt-1 custom-scrollbar custom-board-item" ref={dropRef} style={{ backgroundColor: isOver ? "#f8f9fa" : "" }}>
                {tasks.length > 0 ? (tasks.map((task) => (
                    <TaskCard key={task.id} task={task} name={name} setEditingTask={setEditingTask} deleteTask={deleteTask} />
                ))) : (
                    <div className="d-flex justify-content-center align-items-center text-muted" style={{ height: "100%" }}>{getNoTaskMessage(name)}</div>)
                }

                {/* modal for edit */}
                <div className="modal modal-xl fade w-100" id="editTaskModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-8">
                                        <input className="form-control" type="text" name="name" placeholder="Task Title" value={editingTask?.name || ""} onChange={taskChange} required />
                                        <div className="form-floating mt-3">
                                            <textarea className="form-control" name="description" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: 100 }} value={editingTask?.description || ""} onChange={taskChange}></textarea>
                                            <label htmlFor="floatingTextarea2"><i className="bi bi-list-check me-2"></i>Description</label>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-md-4 d-flex flex-column">
                                                <label className="mb-2">Task Category <span className="text-danger">*</span></label>
                                                <div className="d-flex">
                                                    <button className={`btn btn-light ps-4 pe-4 border custom-category-buttons ${editingTask?.category === "Work" ? "active" : ""}`} onClick={() => setEditingTask((prev) => ({ ...(prev || {}), category: "Work" }))}>Work</button>
                                                    <button className={`btn btn-light ms-3 border custom-category-buttons ${editingTask?.category === "Personal" ? "active" : ""}`} onClick={() => setEditingTask((prev) => ({ ...(prev || {}), category: "Personal" }))}>Personal</button>
                                                </div>
                                            </div>
                                            <div className="col-md-4 d-flex flex-column">
                                                <label className="mb-2">Due on <span className="text-danger">*</span></label>
                                                <input className="form-control" type="date" name="dueDate" value={editingTask?.dueDate || ""} onChange={taskChange} required />
                                            </div>
                                            <div className="col-md-4 d-flex flex-column">
                                                <label className="mb-2">Task Status <span className="text-danger">*</span></label>
                                                <select className="form-select" name="status" value={editingTask?.status || ""} onChange={taskChange} required>
                                                    <option value="">Choose</option>
                                                    <option value="TO-DO">To-Do</option>
                                                    <option value="IN-PROGRESS">In-Progress</option>
                                                    <option value="COMPLETED">Completed</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="d-grid mt-3 mb-5">
                                            <label className="mb-2">Attachment</label>
                                            <input className="form-control w-50" type="file" multiple onChange={fileChange} />
                                            {editingTask?.attachments?.length > 0 && (
                                                <div className="mt-2">
                                                    {editingTask.attachments.map((file, index) => (
                                                        <div key={index} className="d-flex align-items-center border p-2 rounded mb-2">
                                                            {file?.type?.startsWith("image/") ? (
                                                                <img src={URL.createObjectURL(file)} alt={file.name} className="me-2" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 5 }} />
                                                            ) : (
                                                                <i className="bi bi-file-earmark me-2 text-primary"></i>
                                                            )}
                                                            <span className="flex-grow-1">{file?.name || "Unknown File"}</span>
                                                            <button className="btn btn-sm btn-danger ms-2" onClick={() => removeFile(index)}><i className="bi bi-x-lg"></i></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-4 activity-bg rounded">
                                        <div className="bg-light rounded">
                                            <p className="p-3 mt-2">Activity</p>
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Details</th>
                                                        <th scope="col">Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {editingTask?.activities?.map((activity) => (
                                                        <tr>
                                                            <td>{activity.message}</td>
                                                            <td>{formatTimestampToIST(activity.timestamp)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="modal-footer mt-5">
                                <button type="button" className="btn border modal-cancel-button" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" className="btn modal-create-button" onClick={updateEditedTask}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskBoard;
