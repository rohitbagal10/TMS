import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './features/userSlice';
import taskReducer from './features/taskSlice';
import editTaskReducer from './features/editingSlice';
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'tasks', 'editingTask'],
};

const rootReducer = combineReducers({
    user: userReducer,
    tasks: taskReducer,
    editingTask: editTaskReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

const persistor = persistStore(store);

export { store, persistor };
