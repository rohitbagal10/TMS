import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, removeTask, updateTask } from "../Redux/features/taskSlice";
import React from "react";
import '../styles/taskaccordion.css'
import { getDisplayDate } from "../util/util";
import { selectUser } from "../Redux/features/userSlice";
import { toast } from "react-toastify";

const TaskAccordion = ({ name, tasks, bg, isAddtaskVisible, setSelectedTasks, clearSelection, setClearSelection, selectedTasks }) => {

    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [editingTask, setEditingTask] = useState(null);
    const [task, setTask] = useState({
        id: "",
        name: "",
        description: "",
        dueDate: "",
        status: "",
        category: "",
        attachments: [],
    });

    const taskChange = (e) => {
        const { name, value } = e.target;
        setTask(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const editTaskChange = (e) => {
        const { name, value } = e.target;
        setEditingTask(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        if (clearSelection) {
            setClearSelection(false);
        }
    }, [clearSelection, setClearSelection]);

    const cancelAddingTask = () => {
        setTask({
            id: "",
            name: "",
            description: "",
            dueDate: "",
            status: "",
            category: "",
            attachments: [],
        });
        const collapseElement = document.getElementById("collapseExample");
        collapseElement.classList.remove("show");
    };

    const addNewTask = () => {
        const timestamp = new Date().toISOString().replace(/[^\d]/g, "").slice(0, -3);
        const newTask = { ...task, id: timestamp };
        const { name, category, dueDate, status } = newTask;
        if (!name) {
            toast.error("Task name is required")
            return;
        } else if (!dueDate) {
            toast.error("Task due date is required")
            return;
        } else if (!status) {
            toast.error("Task status is required")
            return;
        } else if (!category) {
            toast.error("Task category is required")
            return;
        }
        dispatch(addTask({ email: user.email, task: newTask }));
        toast.success("Task added successfully!")
        cancelAddingTask();
    };

    const saveTask = () => {
        dispatch(updateTask({ email: user.email, id: editingTask.id, ...editingTask }));
        toast.success("Task updated successfully!");
        setEditingTask(null);
    };
    const deleteTask = (id) => {
        dispatch(removeTask({ email: user.email, id }));
        toast.success("Task deleted successfully");
    };

    const CancelEditing = () => {
        setEditingTask(null);
    };

    const changeStatus = (taskId, newStatus) => {
        dispatch(updateTask({ email: user.email, id: taskId, status: newStatus }));
        toast.success("Task status updated successfully!");
    };

    const checkBoxChange = (task, isChecked) => {
        setSelectedTasks(prev => {
            if (isChecked) {
                return [...prev, task];
            } else {
                return prev.filter(selectedTask => selectedTask.id !== task.id);
            }
        });
    };

    if (tasks.length === 0) {
        return (
            <div className="accordion">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button accordion-button-sm" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${name}`} aria-expanded="true" aria-controls={`collapse-${name}`} style={{ backgroundColor: `${bg}` }}>
                            {`${name}(${tasks.length})`}
                        </button>
                    </h2>
                    <div id={`collapse-${name}`} className="accordion-collapse collapse show">
                        <div className="accordion-body">
                            {isAddtaskVisible &&
                                <div>
                                    <p className="d-inline-flex gap-1 d-none d-sm-block">
                                        <a className="text-decoration-none" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                                            <span className="ms-5">+ ADD TASK</span>
                                        </a>
                                    </p>
                                    <div className="collapse" id="collapseExample">
                                        <div className="card card-body">
                                            <table className="table table-borderless">
                                                <colgroup>
                                                    <col style={{ width: "30%" }} />
                                                    <col style={{ width: "20%" }} />
                                                    <col style={{ width: "20%" }} />
                                                    <col style={{ width: "20%" }} />
                                                    <col style={{ width: "10%" }} />
                                                </colgroup>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <input className="form-control form-control-sm w-75" type="text" name="name" placeholder="Task Name" value={task.name} onChange={(e) => taskChange(e)} />
                                                        </td>
                                                        <td>
                                                            <input className="form-control form-control-sm w-50" min={new Date().toISOString().split("T")[0]} type="date" name="dueDate" value={task.dueDate} placeholder="Add Date" onChange={(e) => taskChange(e)} />
                                                        </td>
                                                        <td>
                                                            <div className="dropdown">
                                                                <i className="bi bi-plus-circle fs-4" data-bs-toggle="dropdown" style={{ cursor: "pointer" }}></i>
                                                                <ul className="dropdown-menu">
                                                                    <li><button className="dropdown-item" onClick={() => setTask({ ...task, status: "TO-DO" })}>TO-DO</button></li>
                                                                    <li><button className="dropdown-item" onClick={() => setTask({ ...task, status: "IN-PROGRESS" })}>IN-PROGRESS</button></li>
                                                                    <li><button className="dropdown-item" onClick={() => setTask({ ...task, status: "COMPLETED" })}>COMPLETED</button></li>
                                                                </ul>
                                                                <span className="ms-2">{task.status}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="dropdown">
                                                                <i className="bi bi-plus-circle fs-4" data-bs-toggle="dropdown" style={{ cursor: "pointer" }}></i>
                                                                <ul className="dropdown-menu">
                                                                    <li><button className="dropdown-item" onClick={() => setTask({ ...task, category: "Work" })}>WORK</button></li>
                                                                    <li><button className="dropdown-item" onClick={() => setTask({ ...task, category: "Personal" })}>PERSONAL</button></li>
                                                                </ul>
                                                                <span className="ms-2">{task.category}</span>
                                                            </div>
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div>
                                                <button className="btn btn-sm btn-success ms-2" onClick={addNewTask}>Add</button>
                                                <button className="btn btn-sm btn-danger ms-3" onClick={cancelAddingTask}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                            <div>
                                <div className="card w-100 h-100">
                                    <p className="text-center p-5 m-5">{`No Tasks ${name}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="accordion">
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button className="accordion-button accordion-button-sm" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${name}`} aria-expanded="true" aria-controls={`collapse-${name}`} style={{ backgroundColor: `${bg}` }}>
                        {`${name}(${tasks.length})`}
                    </button>
                </h2>
                <div id={`collapse-${name}`} className="accordion-collapse collapse show">
                    <div className="accordion-body">

                        {isAddtaskVisible &&
                            <div>
                                <p className="d-inline-flex gap-1 d-none d-sm-block">
                                    <a className="text-decoration-none" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                                        <span className="ms-5">+ ADD TASK</span>
                                    </a>
                                </p>
                                <div className="collapse" id="collapseExample">
                                    <div className="card card-body">
                                        <table className="table table-borderless">
                                            <colgroup>
                                                <col style={{ width: "30%" }} />
                                                <col style={{ width: "20%" }} />
                                                <col style={{ width: "20%" }} />
                                                <col style={{ width: "20%" }} />
                                                <col style={{ width: "10%" }} />
                                            </colgroup>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <input className="form-control form-control-sm w-75" type="text" name="name" placeholder="Task Name" value={task.name} onChange={(e) => taskChange(e)} />
                                                    </td>
                                                    <td>
                                                        <input className="form-control form-control-sm w-50" min={new Date().toISOString().split("T")[0]} type="date" name="dueDate" value={task.dueDate} placeholder="Add Date" onChange={(e) => taskChange(e)} />
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <i className="bi bi-plus-circle fs-4" data-bs-toggle="dropdown" style={{ cursor: "pointer" }}></i>
                                                            <ul className="dropdown-menu">
                                                                <li><button className="dropdown-item" onClick={() => setTask({ ...task, status: "TO-DO" })}>TO-DO</button></li>
                                                                <li><button className="dropdown-item" onClick={() => setTask({ ...task, status: "IN-PROGRESS" })}>IN-PROGRESS</button></li>
                                                                <li><button className="dropdown-item" onClick={() => setTask({ ...task, status: "COMPLETED" })}>COMPLETED</button></li>
                                                            </ul>
                                                            <span className="ms-2">{task.status}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <i className="bi bi-plus-circle fs-4" data-bs-toggle="dropdown" style={{ cursor: "pointer" }}></i>
                                                            <ul className="dropdown-menu">
                                                                <li><button className="dropdown-item" onClick={() => setTask({ ...task, category: "Work" })}>WORK</button></li>
                                                                <li><button className="dropdown-item" onClick={() => setTask({ ...task, category: "Personal" })}>PERSONAL</button></li>
                                                            </ul>
                                                            <span className="ms-2">{task.category}</span>
                                                        </div>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div>
                                            <button className="btn btn-sm btn-success ms-2" onClick={addNewTask}>Add</button>
                                            <button className="btn btn-sm btn-danger ms-3" onClick={cancelAddingTask}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        <div className="d-none d-md-block">
                            <table className="table table-borderless">
                                <colgroup>
                                    <col style={{ width: "30%" }} />
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "10%" }} />
                                </colgroup>
                                <tbody>
                                    {tasks.map((task) => (
                                        <React.Fragment key={task.id}>
                                            {editingTask?.id === task.id ? (
                                                <tr>
                                                    <td colSpan="5">
                                                        <div className="card card-body">
                                                            <table className="table table-borderless">
                                                                <colgroup>
                                                                    <col style={{ width: "30%" }} />
                                                                    <col style={{ width: "20%" }} />
                                                                    <col style={{ width: "20%" }} />
                                                                    <col style={{ width: "20%" }} />
                                                                    <col style={{ width: "10%" }} />
                                                                </colgroup>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <input className="w-75 form-control form-control-sm" type="text" name="name" value={editingTask.name} onChange={(e) => editTaskChange(e)} />
                                                                        </td>
                                                                        <td>
                                                                            <input className="w-50 form-control form-control-sm" name="dueDate" type="date" value={editingTask.dueDate} onChange={(e) => editTaskChange(e)} />
                                                                        </td>
                                                                        <td>
                                                                            <div className="dropdown">
                                                                                <i className="bi bi-plus-circle fs-4" data-bs-toggle="dropdown" style={{ cursor: "pointer" }}></i>
                                                                                <ul className="dropdown-menu">
                                                                                    <li><button className="dropdown-item" onClick={() => setEditingTask({ ...task, status: "TO-DO" })}>TO-DO</button></li>
                                                                                    <li><button className="dropdown-item" onClick={() => setEditingTask({ ...task, status: "IN-PROGRESS" })}>IN-PROGRESS</button></li>
                                                                                    <li><button className="dropdown-item" onClick={() => setEditingTask({ ...task, status: "COMPLETED" })}>COMPLETED</button></li>
                                                                                </ul>
                                                                                <span className="ms-2">{editingTask.status}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="dropdown">
                                                                                <i className="bi bi-plus-circle fs-4" data-bs-toggle="dropdown" style={{ cursor: "pointer" }}></i>
                                                                                <ul className="dropdown-menu">
                                                                                    <li><button className="dropdown-item" onClick={() => setEditingTask({ ...task, category: "Work" })}>WORK</button></li>
                                                                                    <li><button className="dropdown-item" onClick={() => setEditingTask({ ...task, category: "Personal" })}>PERSONAL</button></li>
                                                                                </ul>
                                                                                <span className="ms-2">{editingTask.category}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <div>
                                                                <button className="btn btn-sm btn-success ms-2" onClick={saveTask}>Save</button>
                                                                <button className="btn btn-sm btn-danger ms-3" onClick={CancelEditing}>Cancel</button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr className="custom-table-row border-bottom">
                                                    <td className="d-flex align-items-center">
                                                        <input className="form-check-input task-checkbox" type="checkbox" value={task.id} checked={selectedTasks.some(selectedTask => selectedTask.id === task.id)} onChange={(e) => checkBoxChange(task, e.target.checked)} />
                                                        <div className="d-flex align-items-center ms-2">
                                                            <div>
                                                                <i className="bi bi-three-dots-vertical text-secondary m-0 p-0"></i>
                                                            </div>
                                                            <div className="custom-v-dots">
                                                                <i className="bi bi-three-dots-vertical text-secondary ms-n1"></i>
                                                            </div>
                                                        </div>
                                                        <i className={`bi bi-check-circle-fill custom-check-circle ${task.status === 'COMPLETED' ? 'text-success' : ''}`}></i>
                                                        <div className="ms-2">{task.status === 'COMPLETED' ? <span className="text-decoration-line-through">{task.name}</span> : <span>{task.name}</span>}</div>
                                                    </td>
                                                    <td>{getDisplayDate(task.dueDate)}</td>
                                                    <td>
                                                        <div className="dropdown" data-bs-toggle="dropdown">
                                                            <button className="btn btn-sm custom-status-button" >{task.status}</button>
                                                            <ul className="dropdown-menu">
                                                                <li><button className="dropdown-item" onClick={() => changeStatus(task.id, "TO-DO")}>TO-DO</button></li>
                                                                <li><button className="dropdown-item" onClick={() => changeStatus(task.id, "IN-PROGRESS")}>IN-PROGRESS</button></li>
                                                                <li><button className="dropdown-item" onClick={() => changeStatus(task.id, "COMPLETED")}>COMPLETED</button></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                    <td>{task.category}</td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <i className="bi bi-three-dots" data-bs-toggle="dropdown" style={{ cursor: "pointer" }}></i>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <button className="dropdown-item d-flex" onClick={() => setEditingTask(task)}>
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
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="d-block d-sm-none">
                            <table className="table table-borderless">
                                <colgroup>
                                    <col style={{ width: "100%" }} />
                                </colgroup>
                                <tbody>
                                    {tasks.map((task) => (
                                        <tr className="custom-table-row border-bottom">
                                            <td className="d-flex align-items-center">
                                                <input className="form-check-input task-checkbox" type="checkbox" value={task.id} checked={selectedTasks.some(selectedTask => selectedTask.id === task.id)} onChange={(e) => checkBoxChange(task, e.target.checked)} />
                                                <div className="d-flex align-items-center ms-2">
                                                    <div>
                                                        <i className="bi bi-three-dots-vertical text-secondary m-0 p-0"></i>
                                                    </div>
                                                    <div className="custom-v-dots">
                                                        <i className="bi bi-three-dots-vertical text-secondary ms-n1"></i>
                                                    </div>
                                                </div>
                                                <i className={`bi bi-check-circle-fill custom-check-circle ${task.status === 'COMPLETED' ? 'text-success' : ''}`}></i>
                                                <div className="ms-2">{task.status === 'COMPLETED' ? <span className="text-decoration-line-through">{task.name}</span> : <span>{task.name}</span>}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};


export default TaskAccordion;