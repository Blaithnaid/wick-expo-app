// this file is going to be used to manage the tasks context for the calendar tab 
// tasks provider creates a global state for tasks that can be accessed anywhere in your app

import React, { createContext, useContext, useState, useEffect} from 'react';

// task types 
interface Task {
  id: string;
  name: string;
  note: string;
  startTime: string;
  endTime: string;
  reminderEnabled: boolean;
  category: string;
  completed: boolean;
}

interface TasksContextType {
tasks : Task[];
addTask: (task: Task) => void;
editTask: (task: Task) => void;
deleteTask: (id: string) => void;
toggleTaskCompleted: (id: string) => void;
getTasksForDate: (date: string) => Task[];
}

// this line is creating an empty container for the tasks data
const TasksContext = createContext<TasksContextType | undefined>(undefined);



export function TasksProvider({ children }: { children: React.ReactNode }) {
 const [tasks, setTasks] = useState<Task[]>([]);
 
// maybe can add persistance here if needed like async storage or something

// this add task function will be used to add a task to the list of tasks
 const addTask = (task: Task) => {
   setTasks(currentTasks => [...currentTasks, task]);
 };

 // this edit task function will be used to edit a task in the list of tasks
 const editTask = (task: Task) => {
    setTasks(currentTasks => currentTasks.map(t => t.id === task.id ? task : t)
);
};

    const deleteTask = (id: string) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== id));
    };
    
    const toggleTaskCompleted = (id: string) => {
    setTasks(currentTasks => currentTasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };
    
    // this function will be used to get the tasks for a specific date
    // it will filter the tasks based on the start time of the task and return the tasks for that date
    const getTasksForDate = (date: string) => {
    return tasks.filter(task => new Date(task.startTime).toLocaleDateString() === date);
    };
    
    return (
    <TasksContext.Provider value={{ tasks, addTask, editTask, deleteTask, toggleTaskCompleted, getTasksForDate }}>
        {children}
    </TasksContext.Provider>
    );
    }

    // a hook for using the tasks context, this will be used in the components that need to access the tasks context
    export function useTasks() {
        const context = useContext(TasksContext); // reaching into the container to grab whats inside basically
        if (context === undefined) {
            throw new Error('useTasks must be used within a TasksProvider');
        }
        return context;

    }


// // function to add a task to the list
// const addTask = (task: Task) => {
//   setTasks(currentTasks => [...currentTasks, task]);
// };

// // function to edit a task in the list
// const editTask = (task: Task) => {
//   setTasks(currentTasks =>    );
// };


// think of it like taskscontext is the empty container we created for the data,
// usecontext() is the function we reach our hand into,
// context is whatever we pull out of that container

