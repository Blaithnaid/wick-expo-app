// this file is going to be used to manage the tasks context for the calendar tab
// tasks provider creates a global state for tasks that can be accessed anywhere in your app

import React, { createContext, useContext, useState, useEffect } from "react";
import { useFirebaseContext } from "@/services/FirebaseProvider"; 
import { collection, arrayUnion, arrayRemove, getDocs, addDoc, deleteDoc, updateDoc, query, orderBy, where, onSnapshot, doc } from "firebase/firestore"; // Import Firestore functions
import { useAuthContext } from "@/services/AuthProvider"; // Import the AuthProvider

// task types
interface Task {
	id: string;
	name: string;
	note: string;
	date: string;
	startTime: string;
	endTime: string;
	reminderEnabled: boolean;
	category: string;
	completed: boolean;
	//userId?: string;
}

interface TasksContextType {
	tasks: Task[];
	addTask: (task: Omit<Task, 'id'>) =>Promise< void>; // async function to add tasks that doesnt return a value
	editTask: (task: Task) => Promise<void>; // async function to edit tasks that doesnt return a value
	deleteTask: (id: string) => Promise<void>;
	toggleTaskCompleted: (id: string) => Promise<void>;
	getTasksForDate: (date: string) => Task[];
	//loading: boolean; // Add loading state
}

// this line is creating an empty container for the tasks data
const TasksContext = createContext<TasksContextType | undefined>(undefined);

// this is the provider component that will wrap the app and provide the tasks context to the rest of the app
export function TasksProvider({ children }: { children: React.ReactNode }) {
	const [tasks, setTasks] = useState<Task[]>([]);
	//const [loading, setLoading] = useState(true); // Loading state

	const auth = useAuthContext(); // Get the user from the AuthProvider
	const firebase = useFirebaseContext(); // Get the firebase instance from the FirebaseProvider

	// maybe can add persistance here if needed like async storage or something
	useEffect(() => {
        if (!auth.user) {
            setTasks([]);
           // setLoading(false);
            return;
        }
		

		// firestore not trigging the onsnapshot updaye, maybe cos of arrayUnion
		const userDocRef = doc(firebase.myFS, "users", auth.user.uid); // Get the user document reference
		const unsubscribe = onSnapshot(userDocRef, (doc) => {
			const userData = doc.data(); // Get the user data
			console.log("snapshot update:", userData?.tasks); // Log the user data
			setTasks(userData?.tasks || []); // Set the tasks state to the user tasks or an empty array
		});

		return () => unsubscribe(); 
	}, [auth.user, firebase.myFS]); // Run this effect when the user changes or the firebase instance changes
		



	// this add task function will be used to add a task to the list of tasks, no longer need callback
	const addTask = async (task: Omit<Task, 'id'>) => { 
		if (!auth.user) return; // If the user is not logged in, do nothing

		const newTask = {
			...task,
			createdAt: new Date().toISOString(),
			reminderEnabled: task.reminderEnabled ?? false,
			category: task.category ?? "default",
			completed: false
		};
		try {
            const userDocRef = doc(firebase.myFS, "users", auth.user.uid);
            await updateDoc(userDocRef, {
                tasks: arrayUnion(newTask)
            });
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    };

	const deleteTask = async (taskId: string) => {
        if (!auth.user) return;

        const taskToDelete = tasks.find(t => t.id === taskId);
        if (!taskToDelete) return;

        try {
            const userDocRef = doc(firebase.myFS, "users", auth.user.uid);
            await updateDoc(userDocRef, {
                tasks: arrayRemove(taskToDelete)
            });
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    };

	const toggleTaskCompleted = async (taskId: string) => {
        if (!auth.user) return;

        const taskToUpdate = tasks.find(t => t.id === taskId);
        if (!taskToUpdate) return;

        const updatedTask = {
            ...taskToUpdate,
            completed: !taskToUpdate.completed
        };

        try {
            const userDocRef = doc(firebase.myFS, "users", auth.user.uid);
            // Remove old task and add updated one
            await updateDoc(userDocRef, {
                tasks: arrayRemove(taskToUpdate)
            });
            await updateDoc(userDocRef, {
                tasks: arrayUnion(updatedTask)
            });
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    };
	
	const editTask = async (task: Task) => {
        if (!auth.user) return;

        const oldTask = tasks.find(t => t.id === task.id);
        if (!oldTask) return;

        try {
            const userDocRef = doc(firebase.myFS, "users", auth.user.uid);
            // Remove old task and add updated one
            await updateDoc(userDocRef, {
                tasks: arrayRemove(oldTask)
            });
            await updateDoc(userDocRef, {
                tasks: arrayUnion(task)
            });
        } catch (error) {
            console.error("Error editing task:", error);
            throw error;
        }
    };

	

	// this function will be used to get the tasks for a specific date
	// it will filter the tasks based on the start time of the task and return the tasks for that date
	const getTasksForDate = (date: string) => {
		return tasks.filter(task => task.date === date
		);
	};

	return (
		<TasksContext.Provider
			value={{
				tasks,
				addTask,
				editTask,
				deleteTask,
				toggleTaskCompleted,
				getTasksForDate,
				//loading
			}}
		>
			{children}
		</TasksContext.Provider>
	);
}

// a hook for using the tasks context, this will be used in the components that need to access the tasks context
export function useTasks() {
	const context = useContext(TasksContext); // reaching into the container to grab whats inside basically
	if (context === undefined) {
		throw new Error("useTasks must be used within a TasksProvider");
	}
	return context;
}


// custom hook
// think of it like taskscontext is the empty container we created for the data,
// usecontext() is the function we reach our hand into,
// context is whatever we pull out of that container

// example of it being used in the homepage could be
// const homepage = () => {
//     const { tasks, getTasksForDate } = useTasks();

// return (
//     <View>
//       <Text>Tasks for today: {todaysTasks.length}</Text>
//       {todaysTasks.map(task => (

// Promise resolves to a void, indicates async function, automatically notifies when the operation is done
// taskprovider wraps the app and uses UseEffect to listen for firestore changes 


