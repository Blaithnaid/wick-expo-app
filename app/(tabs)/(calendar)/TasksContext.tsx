// this file is going to be used to manage the tasks context for the calendar tab
// it will provide the tasks and the functions to manage them   
// it will also provide the functions to add, edit and delete tasks

import React, { createContext, useContext, useState } from 'react';

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

}

export function TasksProvider({ children }: { children: React.ReactNode }) {

}