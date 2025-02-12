import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasksByUser: {},
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action) => {
            const { email, task } = action.payload;

            state.tasksByUser = state.tasksByUser || {};

            if (!email) {
                console.error("Email is undefined in addTask payload.");
                return;
            }
            if (!state.tasksByUser[email]) {
                state.tasksByUser[email] = [];
            }
            const createdTime = new Date();
            task.activities = [
                {
                    message: `Task created`,
                    timestamp: createdTime.toISOString(),
                },
            ];
            if (task.attachments && task.attachments.length > 0) {
                task.activities.push({
                    message: `You uploaded a file`,
                    timestamp: createdTime.toISOString(),
                });
            }
            state.tasksByUser[email].push(task);
        },
        removeTask: (state, action) => {
            const { email, id } = action.payload;

            state.tasksByUser = state.tasksByUser || {};

            if (state.tasksByUser[email]) {
                state.tasksByUser[email] = state.tasksByUser[email].filter(task => task.id !== id);
            }
        },
        updateTask: (state, action) => {
            const { email, id, ...updatedFields } = action.payload;

            state.tasksByUser = state.tasksByUser || {};

            if (state.tasksByUser[email]) {
                state.tasksByUser[email] = state.tasksByUser[email].map(task => {
                    if (task.id === id) {
                        const updatedTask = { ...task, ...updatedFields };
                        updatedTask.activities = [...(task.activities || [])];
                        const currentTime = new Date();
                        if (updatedFields.status && updatedFields.status !== task.status) {
                            updatedTask.activities = updatedTask.activities.filter(
                                activity => !activity.message.startsWith("You changed status")
                            );
                            updatedTask.activities.push({
                                message: `You changed status from ${task.status || "N/A"} to ${updatedFields.status}`,
                                timestamp: currentTime.toISOString(),
                            });
                        }
                        if (updatedFields.attachments) {
                            if (updatedFields.attachments.length > (task.attachments || []).length) {
                                updatedTask.activities = updatedTask.activities.filter(
                                    activity => !activity.message.startsWith("You uploaded a file")
                                );
                                updatedTask.activities.push({
                                    message: `You uploaded a file`,
                                    timestamp: currentTime.toISOString(),
                                });
                            } else if (updatedFields.attachments.length === 0) {
                                updatedTask.activities = updatedTask.activities.filter(
                                    activity => !activity.message.startsWith("You uploaded a file")
                                );
                            }
                        }
                        updatedTask.activities = updatedTask.activities.slice(-3);
                        return updatedTask;
                    }
                    return task;
                });
            }
        },
    },
});



const selectTasksByUserState = (state) => state.tasks?.tasksByUser;

export const selectTasksByUser = createSelector(
    [selectTasksByUserState, (_, email) => email],
    (tasksByUser, email) => tasksByUser?.[email] || []
);

export const { addTask, removeTask, updateTask } = taskSlice.actions;

export default taskSlice.reducer;
