import {useEffect, useState } from "react";
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
import { useTasks } from "@/contexts/TasksContext";

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

	// Storing all tasks using the tasks context
	const [tasks, addTask, deleteTask, toggleTaskCompletion, getTasksForDate] = useState();

	// Store currently selected day to view tasks
	const [selectedCalendarDate, setSelectedCalendarDate] = useState("");

	// calendar navigation
	const [viewDate, setViewDate] = useState(new Date());

	// Default categories with pastel colours
	const [categoryColors, setCategoryColors] = useState<
		Record<string, Category>
	>({
		Content: {
			name: "Content",
			bg: "#F3EFFC",
			bgdark: "",
			dot: "#6c5ce7",
			border: "#6c5ce7",
		},
		Social: {
			name: "Social",
			bg: "#E6F7F1",
			bgdark: "",
			dot: "#00b894",
			border: "#00b894",
		},
		Work: {
			name: "Work",
			bg: "#E6F2FA",
			bgdark: "",
			dot: "#0984e3",
			border: "#0984e3",
		},
	});

	// Today's date for first selection, date format is YYYY-MM-DD
	const today = new Date();
	const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1).toString()
		.padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

		// get days in the month
	const getDaysInMonth = (month: number, year: number) => {
		new Date(year, month + 1, 0).getDate();
	};

	

	// get the days for the current month
	const generateCalendarDays = () => {
		const year = viewDate.getFullYear();
		const month = viewDate.getMonth();





	// Generate marked dates object for calendar from tasks
	const generateMarkedDates = () => {
		const markedDates: any = {};

		// Group tasks by date
		tasks.forEach((task) => {
			if (!markedDates[task.date]) {
				markedDates[task.date] = { dots: [], marked: true };
			}

			// Add a dot beside category
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
		return tasks.filter((task) => task.date === selectedCalendarDate);
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
			id: Date.now().toString(), //
			name: taskName,
			note: taskNote,
			date: selectedDate || formattedToday, // Use today if no date selected
			startTime,
			endTime,
			reminderEnabled,
			category: selectedCategory || "Content", // Default category if none selected
			completed: false,
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
		setTaskName("");
		setTaskNote("");
		setSelectedDate("");
		setStartTime("");
		setEndTime("");
		setReminderEnabled(false);
		setSelectedCategory("");
	};

	const handleDeleteTask = (taskId: string) => {
		setTasks(tasks.filter((task) => task.id !== taskId));
	};

	const toggleTaskCompletion = (taskId: string) => {
		setTasks(
			tasks.map((task) =>
				task.id === taskId ? { ...task, completed: !task.completed } : task,
			),
		);
	};

	// Close modal without creating a task
	const handleCloseModal = () => {
		resetForm();
		setModalVisible(false);
	};

	// Colour options for new categories
	const colorOptions = [
		{ bg: "#F3EFFC", main: "#6c5ce7" }, // Purple
		{ bg: "#E6F7F1", main: "#00b894" }, // Green
		{ bg: "#E6F2FA", main: "#0984e3" }, // Blue
		{ bg: "#FFEAA7", main: "#fdcb6e" }, // Yellow
		{ bg: "#FFE8E8", main: "#ff7675" }, // Red
		{ bg: "#FFF0F0", main: "#e84393" }, // Pink
		{ bg: "#F1F2F6", main: "#747d8c" }, // Gray
		{ bg: "#FFF3E6", main: "#e67e22" }, // Orange
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
				bg: bgColor,
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
									onPress={() => toggleTaskCompletion(item.id)}
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
											{item.startTime} {item.endTime ? `- ${item.endTime}` : ""}
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
					<Text className="text-white font-bold text-lg">Create New Task</Text>
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
										onPress={() => setSelectedDate("2025-02-02")}
									>
										<View
											className={`${selectedDate === "2025-02-02" ? "bg-purple-600" : "bg-white"} rounded-full w-8 h-8 items-center justify-center`}
										>
											<Text
												className={`${selectedDate === "2025-02-02" ? "text-white" : "text-black"} font-bold`}
											>
												2
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										className="items-center flex-1"
										onPress={() => setSelectedDate("2025-02-03")}
									>
										<View
											className={`${selectedDate === "2025-02-03" ? "bg-purple-600" : "bg-white"} rounded-full w-8 h-8 items-center justify-center`}
										>
											<Text
												className={`${selectedDate === "2025-02-03" ? "text-white" : "text-black"}`}
											>
												3
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										className="items-center flex-1"
										onPress={() => setSelectedDate("2025-02-04")}
									>
										<View
											className={`${selectedDate === "2025-02-04" ? "bg-purple-600" : "bg-white"} rounded-full w-8 h-8 items-center justify-center`}
										>
											<Text
												className={`${selectedDate === "2025-02-04" ? "text-white" : "text-black"}`}
											>
												4
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										className="items-center flex-1"
										onPress={() => setSelectedDate("2025-02-05")}
									>
										<View
											className={`${selectedDate === "2025-02-05" ? "bg-purple-600" : "bg-white"} rounded-full w-8 h-8 items-center justify-center`}
										>
											<Text
												className={`${selectedDate === "2025-02-05" ? "text-white" : "text-black"}`}
											>
												5
											</Text>
										</View>
									</TouchableOpacity>
								</View>

								{/* Calendar Dates - Week 2 */}
								<View className="flex-row justify-between">
									<TouchableOpacity
										className="items-center flex-1"
										onPress={() => setSelectedDate("2025-02-06")}
									>
										<View
											className={`${selectedDate === "2025-02-06" ? "bg-purple-600" : "bg-white"} rounded-full w-8 h-8 items-center justify-center`}
										>
											<Text
												className={`${selectedDate === "2025-02-06" ? "text-white" : "text-black"}`}
											>
												6
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										className="items-center flex-1"
										onPress={() => setSelectedDate("2025-02-07")}
									>
										<View
											className={`${selectedDate === "2025-02-07" ? "bg-purple-600" : "bg-white"} rounded-full w-8 h-8 items-center justify-center`}
										>
											<Text
												className={`${selectedDate === "2025-02-07" ? "text-white" : "text-black"}`}
											>
												7
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										className="items-center flex-1"
										onPress={() => setSelectedDate("2025-02-08")}
									>
										<View
											className={`${selectedDate === "2025-02-08" ? "bg-purple-600" : "bg-white"} rounded-full w-8 h-8 items-center justify-center`}
										>
											<Text
												className={`${selectedDate === "2025-02-08" ? "text-white" : "text-black"}`}
											>
												8
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										className="items-center flex-1"
										onPress={() => setSelectedDate("2025-02-09")}
									>
										<View
											className={`${selectedDate === "2025-02-09" ? "bg-purple-600" : "bg-white"} rounded-full w-8 h-8 items-center justify-center`}
										>
											<Text
												className={`${selectedDate === "2025-02-09" ? "text-white" : "text-black"}`}
											>
												9
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										className="items-center flex-1"
										onPress={() => setSelectedDate("2025-02-10")}
									>
										<View
											className={`${selectedDate === "2025-02-10" ? "bg-purple-600" : "bg-white"} rounded-full w-8 h-8 items-center justify-center`}
										>
											<Text
												className={`${selectedDate === "2025-02-10" ? "text-white" : "text-black"}`}
											>
												10
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										className="items-center flex-1"
										onPress={() => setSelectedDate("2025-02-11")}
									>
										<View
											className={`${selectedDate === "2025-02-11" ? "bg-purple-600" : "bg-white"} rounded-full w-8 h-8 items-center justify-center`}
										>
											<Text
												className={`${selectedDate === "2025-02-11" ? "text-white" : "text-black"}`}
											>
												11
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										className="items-center flex-1"
										onPress={() => setSelectedDate("2025-02-12")}
									>
										<View
											className={`${selectedDate === "2025-02-12" ? "bg-purple-600" : "bg-white"} rounded-full w-8 h-8 items-center justify-center`}
										>
											<Text
												className={`${selectedDate === "2025-02-12" ? "text-white" : "text-black"}`}
											>
												12
											</Text>
										</View>
									</TouchableOpacity>
								</View>
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
										<Ionicons name="calendar-outline" size={20} color="#666" />
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
									<Text className="text-gray-700">Remind me</Text>
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
											<Text className="text-black dark:text-white mr-4">
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
									<Text className="text-purple-600 ml-2">+ Add new</Text>
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
					<View className="bg-white rounded-lg w-11/12 p-4">
						{/* Modal Header */}
						<View className="flex-row justify-between items-center mb-4">
							<Text className="text-xl font-bold">Add New Category</Text>
							<TouchableOpacity
								onPress={() => setAddCategoryModalVisible(false)}
							>
								<Ionicons name="close" size={24} color="#666" />
							</TouchableOpacity>
						</View>

						{/* Category Name Input */}
						<View className="mb-4">
							<Text className="text-gray-500 mb-1">Category Name*</Text>
							<TextInput
								className="border-b border-gray-200 py-2"
								placeholder="Enter category name"
								value={newCategoryName}
								onChangeText={setNewCategoryName}
							/>
						</View>

						{/* Colour Selection */}
						<Text className="text-gray-500 mb-2">Select Color</Text>
						<View className="flex-row flex-wrap mb-4">
							{colorOptions.map((color, index) => (
								<TouchableOpacity
									key={index}
									className="m-2"
									onPress={() => setSelectedColor(color.main)}
								>
									<View
										className={`w-10 h-10 rounded-full ${selectedColor === color.main ? "border-2 border-gray-400" : ""}`}
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
							<Text className="text-gray-500 mb-1">Preview:</Text>
							<View className="flex-row items-center">
								<View
									className="w-4 h-4 rounded-full mr-2"
									style={{ backgroundColor: selectedColor }}
								/>
								<Text>{newCategoryName || "New Category"}</Text>
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
							className="bg-gray-200 rounded-lg py-3"
							onPress={() => setAddCategoryModalVisible(false)}
						>
							<Text className="text-gray-700 text-center font-medium">
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
