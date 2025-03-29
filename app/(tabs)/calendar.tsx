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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Main Calendar View */}
      <View className="px-4 pt-2">
        <Text className="text-2xl font-bold mb-2">Calendar</Text>
      </View>
      
      <Calendar
        current={selectedCalendarDate || formattedToday}
        onDayPress={handleDateSelection}
        markingType="multi-dot"
        markedDates={generateMarkedDates()}
        className="mb-4"
      />
      
      {/* Tasks for selected date */}
      <View className="flex-1 px-4">
        <Text className="text-lg font-semibold mb-2">
          Tasks for {selectedCalendarDate ? new Date(selectedCalendarDate).toLocaleDateString() : 'Today'}
        </Text>
        
        {getTasksForSelectedDate().length === 0 ? (
          <View className="items-center justify-center py-8">
            <Text className="text-gray-500">No tasks for this date</Text>
          </View>
        ) : (
          <FlatList
            data={getTasksForSelectedDate()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View 
                className="mb-3 p-3 rounded-lg flex-row items-center justify-between"
                style={{ 
                  backgroundColor: categoryColors[item.category as keyof typeof categoryColors]?.bg || '#f5f5f5',
                  opacity: item.completed ? 0.7 : 1
                }}
              >
                {/* Checkbox for task completion */}
                <TouchableOpacity 
                  onPress={() => toggleTaskCompletion(item.id)}
                  className="mr-2"
                >
                  <View 
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${item.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}
                  >
                    {item.completed && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                </TouchableOpacity>
                
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <View 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: categoryColors[item.category as keyof typeof categoryColors]?.dot || '#999' }}
                    />
                    <Text className={`font-semibold ${item.completed ? 'line-through text-gray-500' : ''}`}>
                      {item.name}
                    </Text>
                  </View>
                  
                  {item.note ? (
                    <Text className={`text-gray-600 ml-5 mt-1 ${item.completed ? 'line-through' : ''}`}>
                      {item.note}
                    </Text>
                  ) : null}
                  
                  {(item.startTime || item.endTime) ? (
                    <Text className="text-gray-600 ml-5 mt-1">
                      {item.startTime} {item.endTime ? `- ${item.endTime}` : ''}
                    </Text>
                  ) : null}
                </View>
                
                <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      {/* Create Task Button - Centered at bottom */}
      <View className="items-center pb-5 px-4">
        <TouchableOpacity
          className="bg-purple-600 rounded-lg py-3 w-full items-center shadow-md"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white font-bold text-lg">Create Task</Text>
        </TouchableOpacity>
      </View>

      {/* Task Creation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg w-11/12 max-h-4/5">
            <ScrollView>
              {/* Modal Header with Close Button */}
              <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
                <TouchableOpacity 
                  onPress={() => {
                    resetForm();
                    setModalVisible(false);
                  }}
                  className="p-2"
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
                <Text className="text-center text-xl font-bold flex-1">Add New Task</Text>
                <View className="w-8" /> {/* Empty view for centering */}
              </View>

              {/* Mini Calendar Header */}
              <View className="flex-row justify-between items-center px-4 py-2">
                <TouchableOpacity>
                  <Ionicons name="chevron-back" size={24} color="#666" />
                </TouchableOpacity>
                
                <View className="items-center">
                  <Text className="text-lg font-bold">{currentMonth}</Text>
                  <Text className="text-sm text-gray-500">{currentYear}</Text>
                </View>
                
                <TouchableOpacity>
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Mini Calendar */}
              <View className="px-4 pb-2">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-center text-gray-500 flex-1">Mon</Text>
                  <Text className="text-center text-gray-500 flex-1">Tue</Text>
                  <Text className="text-center text-gray-500 flex-1">Wed</Text>
                  <Text className="text-center text-gray-500 flex-1">Thu</Text>
                  <Text className="text-center text-gray-500 flex-1">Fri</Text>
                  <Text className="text-center text-gray-500 flex-1">Sat</Text>
                  <Text className="text-center text-gray-500 flex-1">Sun</Text>
                </View>
                
                {/* Calendar Dates - Week 1 */}
                <View className="flex-row justify-between mb-2">
                  <Text className="text-center text-gray-400 flex-1">31</Text>
                  <Text className="text-center text-gray-400 flex-1">30</Text>
                  <Text className="text-center flex-1">1</Text>
                  <TouchableOpacity 
                    className="items-center flex-1"
                    onPress={() => setSelectedDate('2025-02-02')}
                  >
                    <View className={`${selectedDate === '2025-02-02' ? 'bg-purple-600' : 'bg-white'} rounded-full w-8 h-8 items-center justify-center`}>
                      <Text className={`${selectedDate === '2025-02-02' ? 'text-white' : 'text-black'} font-bold`}>2</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="items-center flex-1"
                    onPress={() => setSelectedDate('2025-02-03')}
                  >
                    <View className={`${selectedDate === '2025-02-03' ? 'bg-purple-600' : 'bg-white'} rounded-full w-8 h-8 items-center justify-center`}>
                      <Text className={`${selectedDate === '2025-02-03' ? 'text-white' : 'text-black'}`}>3</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="items-center flex-1"
                    onPress={() => setSelectedDate('2025-02-04')}
                  >
                    <View className={`${selectedDate === '2025-02-04' ? 'bg-purple-600' : 'bg-white'} rounded-full w-8 h-8 items-center justify-center`}>
                      <Text className={`${selectedDate === '2025-02-04' ? 'text-white' : 'text-black'}`}>4</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="items-center flex-1"
                    onPress={() => setSelectedDate('2025-02-05')}
                  >
                    <View className={`${selectedDate === '2025-02-05' ? 'bg-purple-600' : 'bg-white'} rounded-full w-8 h-8 items-center justify-center`}>
                      <Text className={`${selectedDate === '2025-02-05' ? 'text-white' : 'text-black'}`}>5</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                
                {/* Calendar Dates - Week 2 */}
                <View className="flex-row justify-between">
                  <TouchableOpacity 
                    className="items-center flex-1"
                    onPress={() => setSelectedDate('2025-02-06')}
                  >
                    <View className={`${selectedDate === '2025-02-06' ? 'bg-purple-600' : 'bg-white'} rounded-full w-8 h-8 items-center justify-center`}>
                      <Text className={`${selectedDate === '2025-02-06' ? 'text-white' : 'text-black'}`}>6</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="items-center flex-1"
                    onPress={() => setSelectedDate('2025-02-07')}
                  >
                    <View className={`${selectedDate === '2025-02-07' ? 'bg-purple-600' : 'bg-white'} rounded-full w-8 h-8 items-center justify-center`}>
                      <Text className={`${selectedDate === '2025-02-07' ? 'text-white' : 'text-black'}`}>7</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="items-center flex-1"
                    onPress={() => setSelectedDate('2025-02-08')}
                  >
                    <View className={`${selectedDate === '2025-02-08' ? 'bg-purple-600' : 'bg-white'} rounded-full w-8 h-8 items-center justify-center`}>
                      <Text className={`${selectedDate === '2025-02-08' ? 'text-white' : 'text-black'}`}>8</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="items-center flex-1"
                    onPress={() => setSelectedDate('2025-02-09')}
                  >
                    <View className={`${selectedDate === '2025-02-09' ? 'bg-purple-600' : 'bg-white'} rounded-full w-8 h-8 items-center justify-center`}>
                      <Text className={`${selectedDate === '2025-02-09' ? 'text-white' : 'text-black'}`}>9</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="items-center flex-1"
                    onPress={() => setSelectedDate('2025-02-10')}
                  >
                    <View className={`${selectedDate === '2025-02-10' ? 'bg-purple-600' : 'bg-white'} rounded-full w-8 h-8 items-center justify-center`}>
                      <Text className={`${selectedDate === '2025-02-10' ? 'text-white' : 'text-black'}`}>10</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="items-center flex-1"
                    onPress={() => setSelectedDate('2025-02-11')}
                  >
                    <View className={`${selectedDate === '2025-02-11' ? 'bg-purple-600' : 'bg-white'} rounded-full w-8 h-8 items-center justify-center`}>
                      <Text className={`${selectedDate === '2025-02-11' ? 'text-white' : 'text-black'}`}>11</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="items-center flex-1"
                    onPress={() => setSelectedDate('2025-02-12')}
                  >
                    <View className={`${selectedDate === '2025-02-12' ? 'bg-purple-600' : 'bg-white'} rounded-full w-8 h-8 items-center justify-center`}>
                      <Text className={`${selectedDate === '2025-02-12' ? 'text-white' : 'text-black'}`}>12</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Form Fields */}
              <View className="p-4">
                {/* Task Name */}
                <View className="mb-4">
                  <Text className="text-gray-500 mb-1">Task name*</Text>
                  <TextInput
                    className="border-b border-gray-200 py-2"
                    placeholder="Task name"
                    value={taskName}
                    onChangeText={setTaskName}
                  />
                </View>

                {/* Task Note */}
                <View className="mb-4">
                  <TextInput
                    className="border-b border-gray-200 py-2"
                    placeholder="Type the note here..."
                    value={taskNote}
                    onChangeText={setTaskNote}
                    multiline
                  />
                </View>

                {/* Date Picker */}
                <View className="mb-4 flex-row justify-between items-center">
                  <Text className="text-gray-500">Date</Text>
                  <TouchableOpacity className="flex-row items-center">
                    <Text className="mr-2">{selectedDate || 'Select date'}</Text>
                    <Ionicons name="calendar-outline" size={20} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Time Pickers */}
                <View className="mb-4 flex-row justify-between">
                  <View className="flex-1 mr-2">
                    <Text className="text-gray-500 mb-1">Start time</Text>
                    <TouchableOpacity className="flex-row items-center border-b border-gray-200 py-2">
                      <TextInput
                        placeholder="HH:MM"
                        value={startTime}
                        onChangeText={setStartTime}
                        className="flex-1"
                      />
                      <Ionicons name="time-outline" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1 ml-2">
                    <Text className="text-gray-500 mb-1">End time</Text>
                    <TouchableOpacity className="flex-row items-center border-b border-gray-200 py-2">
                      <TextInput
                        placeholder="HH:MM"
                        value={endTime}
                        onChangeText={setEndTime}
                        className="flex-1"
                      />
                      <Ionicons name="time-outline" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Reminder Toggle */}
                <View className="mb-4 flex-row justify-between items-center">
                  <Text className="text-gray-700">Reminds me</Text>
                  <Switch
                    value={reminderEnabled}
                    onValueChange={setReminderEnabled}
                    trackColor={{ false: "#e9e9e9", true: "#e9e9e9" }}
                    thumbColor={reminderEnabled ? "#6c5ce7" : "#f4f3f4"}
                  />
                </View>

                {/* Category Selection */}
                <Text className="text-gray-700 mb-2">Select Category</Text>
                <View className="flex-row mb-4">
                  <TouchableOpacity 
                    className={`flex-row items-center bg-purple-100 rounded-full px-4 py-2 mr-2 ${selectedCategory === 'Content' ? 'border border-purple-600' : ''}`}
                    onPress={() => setSelectedCategory('Content')}
                  >
                    <View className="w-4 h-4 rounded-full bg-purple-600 mr-2" />
                    <Text>Content</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className={`flex-row items-center bg-green-100 rounded-full px-4 py-2 mr-2 ${selectedCategory === 'Social' ? 'border border-green-500' : ''}`}
                    onPress={() => setSelectedCategory('Social')}
                  >
                    <View className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                    <Text>Social</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className={`flex-row items-center bg-blue-100 rounded-full px-4 py-2 ${selectedCategory === 'Work' ? 'border border-blue-500' : ''}`}
                    onPress={() => setSelectedCategory('Work')}
                  >
                    <View className="w-4 h-4 rounded-full bg-blue-500 mr-2" />
                    <Text>Work</Text>
                  </TouchableOpacity>
                </View>

                {/* Add New Category */}
                <TouchableOpacity className="flex-row items-center mb-4">
                  <Text className="text-purple-600 ml-2">+ Add new</Text>
                </TouchableOpacity>

                {/* Create Task Button */}
                <TouchableOpacity
                  className="bg-purple-600 rounded-lg py-3 mb-4"
                  onPress={handleCreateTask}
                >
                  <Text className="text-white text-center font-bold">Create Task</Text>
                </TouchableOpacity>
                
                {/* Cancel Button */}
                <TouchableOpacity
                  className="bg-gray-200 rounded-lg py-3 mb-4"
                  onPress={() => {
                    resetForm();
                    setModalVisible(false);
                  }}
                >
                  <Text className="text-gray-700 text-center font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CalendarScreen;