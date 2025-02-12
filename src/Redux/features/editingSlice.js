import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    id: "",
    name: "",
    description: "",
    dueDate: "",
    status: "",
    category: "",
    attachments: [],
    activities: [], 
};

const editingTaskSlice = createSlice({
    name: 'editingTask',
    initialState,
    reducers: {
        setEditingTask: (state, action) => action.payload,
        clearEditingTask: () => null,
    },
});
export const getEditingTask = (state) => state.editingTask;
export const { setEditingTask, clearEditingTask } = editingTaskSlice.actions;
export default editingTaskSlice.reducer;
