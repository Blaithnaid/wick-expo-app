import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, Switch, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Task type definition
interface Task {
  id: string;
  name: string;
  note: string;
  date: string;
  startTime: string;
  endTime: string;
  reminderEnabled: boolean;
  category: string;
  completed: boolean; // Added completed field
}

// Category colors mapping
const categoryColors = {
  Content: {
    bg: '#F3EFFC',
    dot: '#6c5ce7',
    border: '#6c5ce7'
  },
  Social: {
    bg: '#E6F7F1',
    dot: '#00b894',
    border: '#00b894'
  },
  Work: {
    bg: '#E6F2FA',
    dot: '#0984e3',
    border: '#0984e3'
  }
};

const CalendarScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskNote, setTaskNote] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentMonth, setCurrentMonth] = useState('February');
  const [currentYear, setCurrentYear] = useState('2025');
  
  // Store all tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Store currently selected day to view tasks
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('');
  
  // Today's date for initial selection
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  // Generate marked dates object for calendar from tasks
  const generateMarkedDates = () => {
    const markedDates: any = {};
    
    // Group tasks by date
    tasks.forEach(task => {
      if (!markedDates[task.date]) {
        markedDates[task.date] = { dots: [], marked: true };
      }
      
      // Add a dot for each category
      markedDates[task.date].dots.push({
        key: task.id,
        color: categoryColors[task.category as keyof typeof categoryColors]?.dot || '#999'
      });
    });
    
    // If there's a selected date, highlight it
    if (selectedCalendarDate) {
      markedDates[selectedCalendarDate] = {
        ...markedDates[selectedCalendarDate],
        selected: true,
        selectedColor: '#6c5ce7'
      };
    }
    
    return markedDates;
  };

  // Filter tasks for the selected date
  const getTasksForSelectedDate = () => {
    return tasks.filter(task => task.date === selectedCalendarDate);
  };

  const handleDateSelection = (day: any) => {
    const dateString = day.dateString;
    setSelectedCalendarDate(dateString);
    console.log("Selected day:", dateString);
  };

  const handleCreateTask = () => {
    // Validate required fields
    if (!taskName || !selectedDate) {
      alert("Task name and date are required");
      return;
    }
    
    // Create new task
    const newTask: Task = {
      id: Date.now().toString(), // Simple unique ID
      name: taskName,
      note: taskNote,
      date: selectedDate || formattedToday, // Use today if no date selected
      startTime,
      endTime,
      reminderEnabled,
      category: selectedCategory || 'Work', // Default category if none selected
      completed: false // Initially not completed
    };
    
    // Add task to list
    setTasks([...tasks, newTask]);
    
    console.log("Task created:", newTask);
    
    // Reset form and close modal
    resetForm();
    setModalVisible(false);
    
    // Select the date of the new task to show it immediately
    setSelectedCalendarDate(newTask.date);
  };

  const resetForm = () => {
    setTaskName('');
    setTaskNote('');
    setSelectedDate('');
    setStartTime('');
    setEndTime('');
    setReminderEnabled(false);
    setSelectedCategory('');
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  // Set initial calendar date when component mounts
  React.useEffect(() => {
    setSelectedCalendarDate(formattedToday);
    }, []);
  
  };


export default CalendarScreen;