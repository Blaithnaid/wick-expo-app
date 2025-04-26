import { useEffect, useState } from "react";
import { Text } from "@/components/Themed";
import {
	View,
	TouchableOpacity,
	Modal,
	TextInput,
	ScrollView,
	Switch,
	FlatList,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTasks } from "@/services/TasksProvider";

// Task type
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
}

// Category type
interface Category {
	name: string;
	bg: string;
	bgdark: string;
	dot: string;
	border: string;
}

// interface DayInfo {
// 	day: number;
// 	date: Date;
// 	currentMonth: boolean;
// 	dateString: string;
// }

// Main Calendar Screen Component
const CalendarScreen = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [taskName, setTaskName] = useState("");
	const [taskNote, setTaskNote] = useState("");
	const [selectedDate, setSelectedDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [reminderEnabled, setReminderEnabled] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [currentMonth, setCurrentMonth] = useState(""); // hopefully this will be dynamic now
	const [currentYear, setCurrentYear] = useState(""); // hopefully this will be dynamic now too
	const colorScheme = useColorScheme().colorScheme;

	// Category creation
	const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [selectedColor, setSelectedColor] = useState("#6c5ce7"); // Default purple

	// using the tasks provider to get the tasks and add, delete, toggle tasks
	const { tasks, addTask, deleteTask, toggleTaskCompleted, getTasksForDate} = useTasks();
	//const {saving, setSaving} = useState(false); // loading state for the tasks
		
	useEffect(() => {
		console.log("CalendarScreen loaded");
		console.log("Tasks array:", tasks);
		console.log("addTask function available:", !!addTask);
	}, [tasks, addTask]);
	// Store currently selected day to view tasks
	const [selectedCalendarDate, setSelectedCalendarDate] = useState("");

	// for calendar navigation
	const [viewDate, setViewDate] = useState(new Date());

	// Default categories with pastel colours
	const [categoryColors, setCategoryColors] = useState<
		Record<string, Category>
	>({
		Content: {
			name: "Content",
			bg: "#F3EFFC",
			bgdark: "4a4676",
			dot: "#6c5ce7",
			border: "#6c5ce7",
		},
		Social: {
			name: "Social",
			bg: "#E6F7F1",
			bgdark: "2b6b5c",
			dot: "#00b894",
			border: "#00b894",
		},
		Work: {
			name: "Work",
			bg: "#E6F2FA",
			bgdark: "2A5470",
			dot: "#0984e3",
			border: "#0984e3",
		},
	});

	// Today's date for first selection, date format is YYYY-MM-DD
	const today = new Date();
	const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1)
		.toString()
		.padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;


		// generate the marked dates object for the calendar from tasks
		const generateMarkedDates = () => {
			const markedDates: any = {};

		// group the tasks by date
		tasks.forEach((task) => {
			if (!markedDates[task.date]) {
				markedDates[task.date] = { dots: [], marked: true };
			}

			// add a dot beside the category
			markedDates[task.date].dots.push({
				key: task.id,
				color: categoryColors[task.category]?.dot || "#999",
			});
		});

	
		// If there's a selected date, highlight it
			if (selectedCalendarDate) {
				markedDates[selectedCalendarDate] = {
					...markedDates[selectedCalendarDate],
					selected: true,
					selectedColor: "#6F6DB2",
				};
			}

			return markedDates;
		};

		// Filter tasks for the selected date, this will be used to show tasks in the calendar
		// and in the task list below the calendar
		const getTasksForSelectedDate = () => {
			return getTasksForDate(selectedCalendarDate);
		};

		const handleDateSelection = (day: any) => {
			const dateString = day.dateString;
			setSelectedCalendarDate(dateString);
			console.log("Selected day:", dateString);
		};

		// format date YYYY-MM-DD for the calendar
		const formatDateToString = (date: Date) => {
			return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
		};

		//get dAYS IN THE MONTH helper
		const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

	// get the current month and year
	const generateCalendarDays = () => {
		const year = viewDate.getFullYear();
		const month = viewDate.getMonth();

			// Get first day of month (0 = Sunday, 1 = Monday, etc.)
			const firstDayOfMonth = new Date(year, month, 1).getDay();
			// Adjust for Monday as first day of week (0 = Monday, 6 = Sunday)
			const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
			

			// get days in the current month
			const daysInMonth = getDaysInMonth(year, month);

			// get days of previous month
			const prevMonthDays = getDaysInMonth(year, month - 1);

			// generate calendar grid with 6 weeks max showing
			const calendarDays = [];
			let currentWeek = [];

			// Add days from previous month
			for (let i = 0; i < startDay; i++) {
				const day = prevMonthDays - startDay + i + 1;
				const date = new Date(year, month - 1, day);
				currentWeek.push({
					day,
					date,
					currentMonth: false,
					dateString: formatDateToString(date)
				});
			}

			// Add days from current month
			for (let i = 1; i <= daysInMonth; i++) { // 1 to 31
				const date = new Date(year, month, i);
				currentWeek.push({
					day: i,
					date,
					currentMonth: true,
					dateString: formatDateToString(date)
				});

				// Start a new week if it is needed
			if (currentWeek.length === 7) {
				calendarDays.push(currentWeek);
				currentWeek = [];
			}
		}

		// Add next month days to complete the grid
		if (currentWeek.length > 0) {
			const daysToAdd = 7 - currentWeek.length;
			for (let i = 1; i <= daysToAdd; i++) {
				const date = new Date(year, month + 1, i);
				currentWeek.push({
					day: i,
					date,
					currentMonth: false,
					dateString: formatDateToString(date)
				});
			}
			calendarDays.push(currentWeek);
		}
		
		return calendarDays;
	};


	// onto the navigation functions 
	const goToPreviousMonth = () => {
		const newDate = new Date(viewDate);
		newDate.setMonth(newDate.getMonth() - 1);
		setViewDate(newDate);
		setCurrentMonth(newDate.toLocaleString('default', { month: 'long' }));
		setCurrentYear(newDate.getFullYear().toString());
	};

	const goToNextMonth = () => {
		const newDate = new Date(viewDate);
		newDate.setMonth(newDate.getMonth() + 1);
		setViewDate(newDate);
		setCurrentMonth(newDate.toLocaleString('default', { month: 'long' }));
		setCurrentYear(newDate.getFullYear().toString());
	};
	
	// Initialize current month and year on component mount
	useEffect(() => {
		const now = new Date();
		setViewDate(now);
		setCurrentMonth(now.toLocaleString('default', { month: 'long' }));
		setCurrentYear(now.getFullYear().toString());
	}, []);



		const handleCreateTask = async () => {
			console.log("Creating task..."); // debugging
			// Validate required fields
			if (!taskName || !selectedDate) {
				alert("Task name and date are required");
				return;
			}

			// Create new task
			try {
			const newTask = {
				//id: Date.now().toString(), 
				name: taskName,
				note: taskNote,
				date: selectedDate || formattedToday, // Use today if no date selected
				startTime,
				endTime,
				reminderEnabled,
				category: selectedCategory || "Content", // Default category if none selected
				completed: false,
			};
			console.log("New task object:", newTask);
    		console.log("addTask function exists?", typeof addTask);
    		console.log("Current tasks array:", tasks);
			console.log("About to add a task:", newTask); // debugging

			

			// context function instead of the setTasks function
			await addTask(newTask);
			

			console.log("Task created:", newTask); // debugging

			// Reset form and close modal
			resetForm();
			setModalVisible(false);
			// Select the date of the new task to show it immediately
			setSelectedCalendarDate(newTask.date);
		} catch (error) {
			console.error("Error creating task:", error); // debugging
			alert("Failed to create task. Please try again.");
		} finally {
			//setSaving(false); // Reset loading state
		}
		};

		const resetForm = () => {
			setTaskName("");
			setTaskNote("");
			setSelectedDate("");
			setStartTime("");
			setEndTime("");
			setReminderEnabled(false);
			setSelectedCategory("");
		};

		

		// Close modal without creating a task
		const handleCloseModal = () => {
			resetForm();
			setModalVisible(false);
		};

		// Function to handle task deletion
		const handleDeleteTask = async (taskId: string) => {
			try {
				await deleteTask(taskId);
				console.log("Task deleted:", taskId); // debugging
			}
			catch (error) {
				console.error("Error deleting task:", error); // debugging
				alert("Failed to delete task. Please try again.");
			}
		};

		// Function to handle task completion toggle
		const handleToggleTask = async (taskId: string) => {
			try {
				await toggleTaskCompleted(taskId);
			} catch (error) {
				console.error("Error toggling task completion:", error); // debugging
				alert("Failed to toggle task completion. Please try again.");
			}
		};

		// Colour options for new categories
		const colorOptions = [
			{ bg: "#F3EFFC", bgdark: "#4A4676", main: "#6c5ce7" }, // Purple
			{ bg: "#E6F7F1", bgdark: "#2B6B5C", main: "#00b894" }, // Green
			{ bg: "#E6F2FA", bgdark: "#2A5470", main: "#0984e3" }, // Blue
			{ bg: "#FFEAA7", bgdark: "#7A6B3C", main: "#fdcb6e" }, // Yellow
			{ bg: "#FFE8E8", bgdark: "#7A4B4B", main: "#ff7675" }, // Red
			{ bg: "#FFF0F0", bgdark: "#7A4465", main: "#e84393" }, // Pink
			{ bg: "#F1F2F6", bgdark: "#4A4D53", main: "#747d8c" }, // Gray
			{ bg: "#FFF3E6", bgdark: "#7A5B3C", main: "#e67e22" }, // Orange
		];

		// Function to create a new category
		const handleCreateCategory = () => {
			if (!newCategoryName.trim()) {
				alert("Category name is required");
				return;
			}

			// Check if category name already exists
			if (categoryColors[newCategoryName]) {
				alert("This category already exists");
				return;
			}

			// Choose background colour based on selected colour
			const selectedColorObj = colorOptions.find(
				(color) => color.main === selectedColor,
			);
			const bgColor = selectedColorObj?.bg || "#f5f5f5";

			// Adding a new category
			setCategoryColors({
				...categoryColors,
				[newCategoryName]: {
					name: newCategoryName,
					bg: selectedColorObj?.bg || "#f5f5f5",
					bgdark: selectedColorObj?.bgdark || "#4A4A4A",
					dot: selectedColor,
					border: selectedColor,
				},
			});
			
		
			// Close modal and reset
			setAddCategoryModalVisible(false);
			setNewCategoryName("");
			setSelectedColor("#6c5ce7");
		};

		// Set initial calendar date when component mounts
		useEffect(() => {
			setSelectedCalendarDate(formattedToday);
		}, [formattedToday]);

		return (
			<SafeAreaView className="h-full flex flex-col justify-between dark:bg-oxford-500 bg-white">
				<Calendar
					current={selectedCalendarDate || formattedToday}
					onDayPress={handleDateSelection}
					markingType="multi-dot"
					markedDates={generateMarkedDates()}
					className="mb-4"
					style={{
						backgroundColor: colorScheme === "dark" ? "#2E3443" : "#ffffff",
					}}
					theme={{
						monthTextColor: "#fff",
						dayTextColor: "#fff",
						calendarBackground: colorScheme === "dark" ? "#2E3443" : "#ffffff",
					}}
				/>

				{/* Tasks for selected date */}
				<View className="flex-1 px-4 bg-white dark:bg-oxford-400">
					<Text className="text-lg font-semibold mb-2">
						Tasks for{" "}
						{selectedCalendarDate
							? new Date(selectedCalendarDate).toLocaleDateString()
							: "Today"}
					</Text>

					{getTasksForSelectedDate().length === 0 ? (
						<View className="items-center justify-center py-8 bg-oxford-400">
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
										backgroundColor:
											categoryColors[item.category]?.bg || "#f5f5f5",
										opacity: item.completed ? 0.7 : 1,
									}}
								>
									{/* Completion Checkbox */}
									<TouchableOpacity
										className="mr-2"
										onPress={() => handleToggleTask(item.id)}
									>
										<View
											style={{
												width: 24,
												height: 24,
												borderRadius: 6,
												borderWidth: 2,
												borderColor:
													categoryColors[item.category]?.border || "#ccc",
												backgroundColor: item.completed
													? categoryColors[item.category]?.border
													: "white",
												alignItems: "center",
												justifyContent: "center",
											}}
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
												style={{
													backgroundColor:
														categoryColors[item.category]?.dot || "#999",
												}}
											/>
											<Text
												className={`font-semibold ${item.completed ? "line-through text-gray-500" : ""}`}
											>
												{item.name}
											</Text>
										</View>

										{item.note ? (
											<Text
												className={`text-gray-600 ml-5 mt-1 ${item.completed ? "line-through" : ""}`}
											>
												{item.note}
											</Text>
										) : null}

										{item.startTime || item.endTime ? (
											<Text className="text-gray-600 ml-5 mt-1">
												{item.startTime}{" "}
												{item.endTime ? `- ${item.endTime}` : ""}
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

				{/* new rectangle create task button at bottom*/}
				<View className="pb-8 px-8">
					<TouchableOpacity
						className="bg-[#6F6DB2] rounded-lg py-4 shadow-lg items-center"
						onPress={() => setModalVisible(true)}
					>
						<Text className="text-white font-bold text-lg">
							Create New Task
						</Text>
					</TouchableOpacity>
				</View>

				{/* task creation modal */}
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={handleCloseModal}
				>
					<View className="flex-1 justify-center items-center bg-black bg-opacity-50">
						<View className="bg-white dark:bg-oxford-500 rounded-lg w-11/12 max-h-4/5">
							{/* Close button at top right */}
							<View className="absolute top-2 right-2 z-10">
								<TouchableOpacity className="p-2" onPress={handleCloseModal}>
									<Ionicons name="close" size={24} color="#666" />
								</TouchableOpacity>
							</View>

							<ScrollView>
								{/* Modal Header */}
								<View className="p-4 border-b border-gray-200">
									<Text className="text-center text-xl font-bold">
										Add New Task
									</Text>
								</View>

								{/* Mini Calendar Header */}
								<View className="flex-row justify-between items-center px-4 py-2">
									<TouchableOpacity onPress={goToPreviousMonth}>
										<Ionicons name="chevron-back" size={24} color="#666" />
									</TouchableOpacity>

									<View className="items-center">
										<Text className="text-lg font-bold">{currentMonth}</Text>
										<Text className="text-sm text-gray-500">{currentYear}</Text>
									</View>

									<TouchableOpacity onPress={goToNextMonth}>
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


								{/*Dynamic Calendar Dates*/}
								{generateCalendarDays().map((week, weekIndex) => (
									<View key={`week-${weekIndex}`} className="flex-row justify-between mb-2">
										{week.map((day, dayIndex) => (
											<TouchableOpacity
												key={`day-${weekIndex}-${dayIndex}`}
												className="items-center flex-1"
												onPress={() => setSelectedDate(day.dateString)}
											>
												<View
													className={`${selectedDate === day.dateString 
														? "bg-purple-600" 
														: "bg-white dark:bg-gray-600"} 
													rounded-full w-8 h-8 items-center justify-center`}
												>
													<Text
														className={`${selectedDate === day.dateString ? "text-white" : 
															day.currentMonth 
															? "text-black dark: text-gray-400"
															: "text-gray-400 dark: text-gray-400"
															
															}`}
													>
														{day.day}

													</Text>
												</View>
											</TouchableOpacity>
										))}
									</View>
								))}
							</View>




								{/* Form Fields */}
								<View className="p-4">
									{/* Task Name */}
									<View className="mb-4">
										<TextInput
											className="border-b border-gray-200 dark:border-gray-400 py-2"
											placeholder="Task name"
											value={taskName}
											onChangeText={setTaskName}
										/>
									</View>

									{/* Task Note */}
									<View className="mb-4">
										<TextInput
											className="border-b border-gray-200 dark:border-gray-400 py-2"
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
											<Text className="mr-2">
												{selectedDate || "Select date"}
											</Text>
											<Ionicons
												name="calendar-outline"
												size={20}
												color="#666"
											/>
										</TouchableOpacity>
									</View>

									{/* Time Pickers */}
									<View className="mb-4 flex-row justify-between">
										<View className="flex-1 mr-2">
											<Text className="text-gray-500 mb-1">Start time</Text>
											<TouchableOpacity className="flex-row items-center border-b border-gray-200 dark:border-gray-400 py-2">
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
											<TouchableOpacity className="flex-row items-center border-b border-gray-200 dark:border-gray-400 py-2">
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

									{/* Reminder Toggle // not working */}
									<View className="mb-4 flex-row justify-between items-center">
										<Text className="text-gray-700 dark:text-gray-300">Remind me</Text>
										<Switch
											value={reminderEnabled}
											onValueChange={setReminderEnabled}
											trackColor={{ false: "#e9e9e9", true: "#e9e9e9" }}
											thumbColor={reminderEnabled ? "#6c5ce7" : "#f4f3f4"}
										/>
									</View>

									{/* category selection */}
									<Text className="text-gray-700 mb-2">Select category</Text>
									<View className="flex-row flex-wrap mb-4">
										{Object.keys(categoryColors).map((categoryName) => (
											<TouchableOpacity
												key={categoryName}
												className={`flex-row items-center rounded-full py-2 mr-2 mb-2 ${
													selectedCategory === categoryName
														? `border border-${categoryColors[categoryName].border}`
														: ""
												}`}
												style={{
													backgroundColor: categoryColors[categoryName].bg,
													borderColor:
														selectedCategory === categoryName
															? categoryColors[categoryName].border
															: "transparent",
													borderWidth: selectedCategory === categoryName ? 1 : 0, 
												}}
												onPress={() => setSelectedCategory(categoryName)}
											>
												<View
													className="w-4 h-4 rounded-full mx-2"
													style={{
														backgroundColor: categoryColors[categoryName].dot,
													}}
												/>
												<Text className="text-black mr-4">
													{categoryName}
												</Text>
											</TouchableOpacity>
										))}
									</View>

									{/* Add New Category */}
									<TouchableOpacity
										className="flex-row items-center mb-4"
										onPress={() => setAddCategoryModalVisible(true)}
									>
										<Text className="text-purple-600 dark:text-purple-400 ml-2">+ Add new</Text>
									</TouchableOpacity>

									{/* Create Task Button */}
									<TouchableOpacity
										className="bg-[#6F6DB2] rounded-lg py-3 mb-4"
										onPress={handleCreateTask}
									>
										<Text className="text-white text-center font-bold">
											Create Task
										</Text>
									</TouchableOpacity>

									{/* Cancel Button */}
									<TouchableOpacity
										className="bg-gray-200 dark:bg-gray-600 rounded-lg py-3 mb-4"
										onPress={handleCloseModal}
									>
										<Text className="text-gray-700 text-center font-medium">
											Cancel
										</Text>
									</TouchableOpacity>
								</View>
							</ScrollView>
						</View>
					</View>
				</Modal>

				{/* Add Category Modal */}
				<Modal
					animationType="slide"
					transparent={true}
					visible={addCategoryModalVisible}
					onRequestClose={() => setAddCategoryModalVisible(false)}
				>
					<View className="flex-1 justify-center items-center bg-black bg-opacity-50">
						<View className="bg-white dark:bg-gray-800 rounded-lg w-11/12 p-4">
							{/* Modal Header */}
							<View className="flex-row justify-between items-center mb-4">
								<Text className="text-xl font-bold text-black dark:text-white">Add New Category</Text>
								<TouchableOpacity
									onPress={() => setAddCategoryModalVisible(false)}
								>
									<Ionicons name="close" size={24} color={colorScheme == "dark" ? "#fff" : "#666"} />
								</TouchableOpacity>
							</View>

							{/* Category Name Input */}
							<View className="mb-4">
								<Text className="text-gray-500 dark:text-gray-300 mb-1">Category Name*</Text>
								<TextInput
									className="border-b border-gray-200 dark:border-gray-400 py-2 text-black dark:text-white"
									placeholder="Enter category name"
									placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
									value={newCategoryName}
									onChangeText={setNewCategoryName}
								/>
							</View>

							{/* Colour Selection */}
							<Text className="text-gray-500 dark:text-gray-300 mb-2">Select Color</Text>
							<View className="flex-row flex-wrap mb-4">
								{colorOptions.map((color, index) => (
									<TouchableOpacity
										key={index}
										className="m-2"
										onPress={() => setSelectedColor(color.main)}
									>
										<View
											className={`w-10 h-10 rounded-full ${selectedColor === color.main ? "border-2 border-gray-400 dark:border-white" : ""}`}
											style={{ backgroundColor: color.main }}
										/>
									</TouchableOpacity>
								))}
							</View>

							{/* Preview */}
							<View
								className="mb-4 p-4 rounded-lg"
								style={{
									backgroundColor:
										colorOptions.find((c) => c.main === selectedColor)?.bg ||
										"#f5f5f5",
								}}
							>
								<Text className="text-gray-700 mb-1">Preview:</Text>
								<View className="flex-row items-center">
									<View
										className="w-4 h-4 rounded-full mr-2"
										style={{ backgroundColor: selectedColor }}
									/>
									<Text className="text-black">{newCategoryName || "New Category"}</Text>
								</View>
							</View>

							{/* Create Button */}
							<TouchableOpacity
								className="bg-[#6F6DB2] rounded-lg py-3 mb-2"
								onPress={handleCreateCategory}
							>
								<Text className="text-white text-center font-bold">
									Create Category
								</Text>
							</TouchableOpacity>

							{/* Cancel Button */}
							<TouchableOpacity
								className="bg-gray-200 dark:bg-gray-700 rounded-lg py-3"
								onPress={() => setAddCategoryModalVisible(false)}
							>
								<Text className="text-gray-700 dark:text-gray-200 text-center font-medium">
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</SafeAreaView>
		);
	};


export default CalendarScreen;

// finally means that this will run no matter what, even if there is an error in the try block