import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addTask, removeTask, selectTasksByUser, updateTask } from "../Redux/features/taskSlice";
import '../styles/dashboard.css'
import TaskAccordion from "../components/TaskAccordion";
import TaskBoard from "../components/TaskBoard";
import { clearUser, selectUser } from "../Redux/features/userSlice";
import { toast } from "react-toastify";
import sad from '../images/sad.png'
import happy from '../images/happy.png'

function Dashboard() {

    const user = useSelector(selectUser);
    const tasks = useSelector(state => selectTasksByUser(state, user.email));
    const [todoTasks, setTodoTasks] = useState([]);
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDueDate, setSelectedDueDate] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const [activeTab, setActiveTab] = useState("list");
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [clearSelection, setClearSelection] = useState(false);
    const [keyword, setKeyword] = useState('')
    const navigate = useNavigate()

    const [task, setTask] = useState({
        id: "",
        name: "",
        description: "",
        dueDate: "",
        status: "",
        category: "",
        attachments: [],
        activities: [], 
    });

    const taskChange = (e) => {
        const { name, value } = e.target;
        setTask((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const fileChange = (e) => {
        const files = Array.from(e.target.files);
        setTask((prevState) => ({
            ...prevState,
            attachments: [...prevState.attachments, ...files],
        }));
    };

    const removeFile = (index) => {
        setTask((prevState) => ({
            ...prevState,
            attachments: prevState.attachments.filter((_, i) => i !== index),
        }));
    };

    const dispatch = useDispatch()

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
    };

    const createNewTask = () => {
        const timestamp = new Date().toISOString().replace(/[^\d]/g, "").slice(0, -3);
        const newTask = { ...task, id: timestamp };
        const { name, category, dueDate, status } = task;
        if (!name) {
            toast.error("Task name is required")
            return;
        } else if (!category) {
            toast.error("Task category is required")
            return;
        } else if (!dueDate) {
            toast.error("Task due date is required")
            return;
        } else if (!status) {
            toast.error("Task status is required")
            return;
        }
        dispatch(addTask({ email: user.email, task: newTask }));
        toast.success("Task added successfully!")
        const modal = document.getElementById('addTaskModal');
        const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
        cancelAddingTask();
    };

    useEffect(() => {
        if (!tasks) return;
        let filteredTasks = tasks;
        if (selectedCategory) {
            filteredTasks = filteredTasks.filter(task => task.category === selectedCategory);
        }
        if (selectedDueDate) {
            const today = new Date().toISOString().split("T")[0];
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowDate = tomorrow.toISOString().split("T")[0];

            if (selectedDueDate === "1") {
                filteredTasks = filteredTasks.filter(task => task.dueDate === today);
            } else if (selectedDueDate === "2") {
                filteredTasks = filteredTasks.filter(task => task.dueDate === tomorrowDate);
            } else if (selectedDueDate.length > 2) {
                filteredTasks = filteredTasks.filter(task => task.dueDate === selectedDueDate);
            }
        }
        if (keyword) {
            const lowerCaseKeyword = keyword.toLowerCase();
            filteredTasks = filteredTasks.filter(task => task.name.toLowerCase().includes(lowerCaseKeyword));
        }
        const todo = filteredTasks.filter(task => task.status === "TO-DO");
        const inProgress = filteredTasks.filter(task => task.status === "IN-PROGRESS");
        const completed = filteredTasks.filter(task => task.status === "COMPLETED");
        setTodoTasks(prev => (JSON.stringify(prev) === JSON.stringify(todo) ? prev : todo));
        setInProgressTasks(prev => (JSON.stringify(prev) === JSON.stringify(inProgress) ? prev : inProgress));
        setCompletedTasks(prev => (JSON.stringify(prev) === JSON.stringify(completed) ? prev : completed));
    }, [tasks, selectedCategory, selectedDueDate, keyword]);

    const logout = () => {
        dispatch(clearUser())
        navigate('/')
        toast.success("Successfully logged out!")
    }

    const sortAscending = () => {
        setTodoTasks(prev => [...prev].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
        setInProgressTasks(prev => [...prev].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
        setCompletedTasks(prev => [...prev].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
        toast.success("Sorted Ascending")
    };

    const sortDescending = () => {
        setTodoTasks(prev => [...prev].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)));
        setInProgressTasks(prev => [...prev].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)));
        setCompletedTasks(prev => [...prev].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)));
        toast.success("Sorted Descending")
    };

    const clearSelectedTasks = () => {
        setSelectedTasks([]);
        setClearSelection(true);
    };



    const updateSelectedTasksStatus = (newStatus) => {
        selectedTasks.forEach((selectedTask) => {
            dispatch(updateTask({ email: user.email, id: selectedTask.id, status: newStatus }));
        });
        toast.success("All selected tasks updated")
        clearSelectedTasks();
    };

    const deleteSelectedTasks = () => {
        selectedTasks.forEach((selectedTask) => {
            dispatch(removeTask({ email: user.email, id: selectedTask.id }));
        });
        toast.success("Deleted all selected tasks")
        clearSelectedTasks();
    };


    return (
        <div>
            {selectedTasks && selectedTasks.length > 0 &&
                <div className="custom-button-br bg-dark selected-task-div position-fixed bottom-0 start-50 translate-middle-x bg-light border rounded shadow p-3 mb-3 text-center">
                    <div className="d-flex align-items-center custom-button-br">
                        <div className="custom-button-br border border-light rounded text-light ps-2 pe-2 p-1">{`${selectedTasks.length} Tasks Selected`}<span onClick={clearSelectedTasks}><Link><i className="bi bi-x ms-2 text-light fs-5"></i></Link></span></div>
                        <i class="bi bi-check-square-fill text-light ms-2 fs-5 "></i>
                        <div className="dropdown">
                            <button className="btn btn-sm text-light border border-light ms-3 ps-3 pe-3 custom-button-br dropdown-toggle" data-bs-toggle="dropdown" type="button">Status</button>
                            <ul className="dropdown-menu">
                                <li><button className="dropdown-item" onClick={() => updateSelectedTasksStatus("TO-DO")}>TO-DO</button></li>
                                <li><button className="dropdown-item" onClick={() => updateSelectedTasksStatus("IN-PROGRESS")}>IN-PROGRESS</button></li>
                                <li><button className="dropdown-item" onClick={() => updateSelectedTasksStatus("COMPLETED")}>COMPLETED</button></li>
                            </ul>
                        </div>

                        <button className="btn btn-sm text-danger border border-danger ms-3 ps-3 pe-3 custom-button-br" onClick={deleteSelectedTasks}>Delete</button>

                    </div>
                </div>}

            <nav className="navbar">
                <div className="container">
                    <div className="d-flex">
                        <i className="bi bi-clipboard2 fs-4"></i>
                        <p className="h3 ms-2">TaskBuddy</p>
                    </div>
                    <div className="d-flex">
                        <div className=" d-flex align-items-center">
                            <div>
                                <img className="user-photo img-fluid" src={user.photoURL || "fallback-image-url"} alt="User" />
                            </div>
                            <div className="ms-2">{user.displayName}</div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="row">
                    <ul className="nav nav-underline w-100 d-flex justify-content-between align-items-center">
                        <div className="d-none d-sm-flex">
                            <li className="nav-item">
                                <Link className={`nav-link ${activeTab === "list" ? "active text-dark" : "text-secondary"}`} onClick={() => setActiveTab("list")} href="#">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-card-list"></i>
                                        <div className="ms-1">List</div>
                                    </div>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${activeTab === "board" ? "active text-dark" : "text-secondary"}`} onClick={() => setActiveTab("board")} href="#">
                                    <div className="d-flex align-items-center ms-3">
                                        <i className="bi bi-kanban"></i>
                                        <div className="ms-1">Board</div>
                                    </div>
                                </Link>
                            </li>
                        </div>
                        <li className="ms-auto">
                            <button className="btn btn-sm btn-danger d-flex align-items-center" onClick={logout}>
                                <i className="bi bi-box-arrow-left"></i>
                                <div className="ms-2">Logout</div>
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="row mt-2 align-items-center">
                    <div className="col-md-auto d-flex align-items-center">Filter By:</div>
                    <div className="col-md-auto col-6">
                        <select className={`form-select form-select-sm ${selectedCategory ? 'bg-success text-white' : ''}`} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option className="bg-light text-dark" value="">Category</option>
                            <option className="bg-light text-dark" value="Work">Work</option>
                            <option className="bg-light text-dark" value="Personal">Personal</option>
                        </select>
                    </div>
                    <div className="col-md-auto col-6">
                        <select className={`form-select form-select-sm ${selectedDueDate ? 'bg-success text-white' : ''}`} value={selectedDueDate} onChange={(e) => setSelectedDueDate(e.target.value)}>
                            <option className="bg-light text-dark" value="">Due Date</option>
                            <option className="bg-light text-dark" value="1">Today</option>
                            <option className="bg-light text-dark" value="2">Tomorrow</option>
                            <option className="bg-light text-dark" value="custom">Pick Date</option>
                        </select>
                    </div>
                    {selectedDueDate === "custom" && (
                        <div className="col-md-auto">
                            <input type="date" className="form-control form-control-sm" onChange={(e) => setSelectedDueDate(e.target.value)} />
                        </div>
                    )}
                    <div className="col-md-auto">
                        <Link className="text-decoration-none text-danger small" onClick={() => { setSelectedCategory(""); setSelectedDueDate(""); }}>Clear Filters</Link>
                    </div>
                    <div className="col-md-auto ms-auto d-flex d-flex flex-column flex-md-row align-items-start">
                        <div className="input-group me-2">
                            <span className="input-group-text bg-white border-end-0 pe-0 me-0"><i className="bi bi-search text-muted"></i></span>
                            <input type="text" className="form-control border-start-0 shadow-none no-focus-outline" placeholder="Search" name="keyword" value={keyword} onChange={(e) => { setKeyword(e.target.value) }} />
                            {keyword && <span className="input-group-text bg-white border-end-0"><i className="bi bi-x" onClick={() => setKeyword('')}></i></span>}
                        </div>

                        <button className="btn addtask-btn ms-2 w-50 ms-auto mt-3 mt-md-0" data-bs-toggle="modal" data-bs-target="#addTaskModal">ADD TASK</button>
                    </div>

                    <div className="h4 mt-3">{keyword && keyword.length > 0 && (<>Search results for <span className="text-danger">"{keyword}"</span></>)}</div>
                </div>

                {keyword && keyword.length > 0 ? (
                    todoTasks.length === 0 && inProgressTasks.length === 0 && completedTasks.length === 0 ? (
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <img className="img-fluid custom-smiley mt-5" src={isHovered ? happy : sad} alt={isHovered ? "happy" : "sad"} />
                            <p className="h4 mt-3">It looks like we can't find any results that match.</p>
                            <button className="btn btn-sm btn-danger ps-3 pe-3" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => setKeyword('')}>Claer</button>
                        </div>
                    ) : (
                        <div>
                            {activeTab === 'list' && <div>
                                <div className="d-none d-sm-block">
                                    <table className="table table-borderless table-responsive mt-3">
                                        <colgroup>
                                            <col style={{ width: "30%" }} />
                                            <col style={{ width: "20%" }} />
                                            <col style={{ width: "20%" }} />
                                            <col style={{ width: "20%" }} />
                                            <col style={{ width: "10%" }} />
                                        </colgroup>
                                        <thead className="border-0 border-top">
                                            <tr>
                                                <th scope="col">Task Name</th>
                                                <th scope="col">
                                                    <div className="d-flex align-items-center">
                                                        <div>Due On</div>
                                                        <Link className="text-dark" onClick={sortAscending}><i className="bi bi-caret-up-fill ms-1"></i></Link>
                                                        <Link className="text-dark" onClick={sortDescending}> <i className="bi bi-caret-down-fill ms-1" ></i></Link>
                                                    </div>
                                                </th>
                                                <th scope="col">Task Status</th>
                                                <th scope="col">Task Category</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                                {todoTasks.length > 0 && <div className="mt-3"><TaskAccordion name="To-Do" tasks={todoTasks} bg="#FAC3FF" isAddtaskVisible="true" selectedTasks={selectedTasks} setSelectedTasks={setSelectedTasks} clearSelection={clearSelection} setClearSelection={setClearSelection} /></div>}
                                {inProgressTasks.length > 0 && <div className="mt-3"><TaskAccordion name="In-Progress" tasks={inProgressTasks} bg="#85D9F1" selectedTasks={selectedTasks} setSelectedTasks={setSelectedTasks} clearSelection={clearSelection} setClearSelection={setClearSelection} /></div>}
                                {completedTasks.length > 0 && <div className="mt-3 mb-5"><TaskAccordion name="Completed" tasks={completedTasks} bg="#CEFFCC" selectedTasks={selectedTasks} setSelectedTasks={setSelectedTasks} clearSelection={clearSelection} setClearSelection={setClearSelection} /></div>}
                            </div>}
                            {activeTab === "board" && (
                                <div className="container mt-3">
                                    <div className="row gap-3 mb-3 h-100">
                                        {todoTasks.length > 0 && <TaskBoard name="TO-DO" tasks={todoTasks} customClass="custom-Todo" />}
                                        {inProgressTasks.length > 0 && <TaskBoard name="IN-PROGRESS" tasks={inProgressTasks} customClass="custom-inprogress" />}
                                        {completedTasks.length > 0 && <TaskBoard name="COMPLETED" tasks={completedTasks} customClass="custom-completed" />}
                                    </div>
                                </div>
                            )}
                        </div>)
                ) : (<div>
                    {activeTab === 'list' && <div>
                        <div className="d-none d-sm-block">
                            <table className="table table-borderless mt-3 ">
                                <colgroup>
                                    <col style={{ width: "30%" }} />
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "10%" }} />
                                </colgroup>
                                <thead className="border-0 border-top">
                                    <tr>
                                        <th scope="col">Task Name</th>
                                        <th scope="col">
                                            <div className="d-flex align-items-center">
                                                <div>Due On</div>
                                                <Link className="text-dark" onClick={sortAscending}><i className="bi bi-caret-up-fill ms-1"></i></Link>
                                                <Link className="text-dark" onClick={sortDescending}> <i className="bi bi-caret-down-fill ms-1" ></i></Link>
                                            </div>
                                        </th>
                                        <th scope="col">Task Status</th>
                                        <th scope="col">Task Category</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                        <div className="mt-3"><TaskAccordion name="To-Do" tasks={todoTasks} bg="#FAC3FF" isAddtaskVisible="true" setSelectedTasks={setSelectedTasks} selectedTasks={selectedTasks} /></div>
                        <div className="mt-3"><TaskAccordion name="In-Progress" tasks={inProgressTasks} bg="#85D9F1" setSelectedTasks={setSelectedTasks} selectedTasks={selectedTasks} /></div>
                        <div className="mt-3 mb-5"><TaskAccordion name="Completed" tasks={completedTasks} bg="#CEFFCC" setSelectedTasks={setSelectedTasks} selectedTasks={selectedTasks} /></div>
                    </div>}
                    {activeTab === "board" && (
                        <div className="container mt-3">
                            <div className="row gap-3 mb-3 h-100">
                                <TaskBoard name="TO-DO" tasks={todoTasks} customClass="custom-Todo" />
                                <TaskBoard name="IN-PROGRESS" tasks={inProgressTasks} customClass="custom-inprogress" />
                                <TaskBoard name="COMPLETED" tasks={completedTasks} customClass="custom-completed" />
                            </div>
                        </div>
                    )}

                    {/* Modal for adding tasks */}
                    <div className="modal modal-lg fade" id="addTaskModal" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <input className="form-control" type="text" name="name" placeholder="Task Title" value={task.name} onChange={taskChange} required />
                                    <div className="form-floating mt-3">
                                        <textarea className="form-control" name="description" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: 100 }} value={task.description} onChange={taskChange}></textarea>
                                        <label htmlFor="floatingTextarea2"><i className="bi bi-list-check me-2"></i>Description</label>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-md-4 col-lg-4 d-flex flex-column mt-3">
                                            <label className="mb-2">Task Category <span className="text-danger">*</span></label>
                                            <div className="d-flex">
                                                <button className={`btn btn-light ps-4 pe-4 border custom-category-buttons ${task.category === "Work" ? "active" : ""}`} onClick={() => setTask((prev) => ({ ...prev, category: "Work" }))}>Work</button>
                                                <button className={`btn btn-light ms-3 border custom-category-buttons ${task.category === "Personal" ? "active" : ""}`} onClick={() => setTask((prev) => ({ ...prev, category: "Personal" }))}>Personal</button>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-lg-4 d-flex flex-column mt-3">
                                            <label className="mb-2">Due on <span className="text-danger">*</span></label>
                                            <input className="form-control" type="date" name="dueDate" value={task.dueDate} onChange={taskChange} required />
                                        </div>
                                        <div className="col-md-4 col-lg-4 d-flex flex-column mt-3">
                                            <label className="mb-2">Task Status <span className="text-danger">*</span></label>
                                            <select className="form-select" name="status" value={task.status} onChange={taskChange} required>
                                                <option value="">Choose</option>
                                                <option value="TO-DO">To-Do</option>
                                                <option value="IN-PROGRESS">In-Progress</option>
                                                <option value="COMPLETED">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="d-grid mt-3 mb-5">
                                        <label className="mb-2">Attachment</label>
                                        <input className="form-control" type="file" multiple onChange={fileChange} />
                                        {task.attachments.length > 0 && (
                                            <div className="mt-2">
                                                {task.attachments.map((file, index) => (
                                                    <div key={index} className="d-flex align-items-center border p-2 rounded mb-2">
                                                        {file.type.startsWith("image/") ? (
                                                            <img src={URL.createObjectURL(file)} alt={file.name} className="me-2" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 5 }} />
                                                        ) : (
                                                            <i className="bi bi-file-earmark me-2 text-primary"></i>
                                                        )}
                                                        <span className="flex-grow-1">{file.name}</span>
                                                        <button className="btn btn-sm btn-danger ms-2" onClick={() => removeFile(index)}><i className="bi bi-x-lg"></i></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer mt-5">
                                    <button type="button" className="btn border modal-cancel-button" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" className="btn modal-create-button" onClick={createNewTask}>Create</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
    );
}

export default Dashboard;
