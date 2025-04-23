// this file is going to be used to manage the tasks context for the calendar tab
// it will provide the tasks and the functions to manage them   
// it will also provide the functions to add, edit and delete tasks

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

const TasksContext = createContext<TasksContextType | undefined>(undefined);



export function TasksProvider({ children }: { children: React.ReactNode }) {
 const [tasks, setTasks] = useState<Task[]>([]);
 
// maybe can add persistance here if needed like async storage or something


 const addTask = (task: Task) => {
   setTasks(currentTasks => [...currentTasks, task]);
 };

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
        
    }


// // function to add a task to the list
// const addTask = (task: Task) => {
//   setTasks(currentTasks => [...currentTasks, task]);
// };

// // function to edit a task in the list
// const editTask = (task: Task) => {
//   setTasks(currentTasks =>    );
// };

// function to delete a task from the list


// function to toggle the completed state of a task



// function to get the tasks for a specific date