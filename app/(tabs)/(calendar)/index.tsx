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
	Platform,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import { FontAwesome } from "@expo/vector-icons";
import { useTasks } from "@/services/TasksProvider";

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
	const [currentMonth, setCurrentMonth] = useState("");
	const [currentYear, setCurrentYear] = useState("");
	const colorScheme = useColorScheme().colorScheme;

	// using the tasks provider to get the tasks and add, delete, toggle tasks
	const {
		tasks,
		addTask,
		deleteTask,
		toggleTaskCompleted,
		getTasksForDate,
		categories,
		addCategory,
	} = useTasks();

	useEffect(() => {
		console.log("CalendarScreen loaded");
		console.log("Tasks array:", tasks);
	}, [tasks]);
	// Store currently selected day to view tasks
	const [selectedCalendarDate, setSelectedCalendarDate] = useState("");

	// for calendar navigation
	const [viewDate, setViewDate] = useState(new Date());

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
				color: categories[task.category]?.dot || "#999",
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

	const formatDate = (date: Date) => {
		const day = date.getDate();
		const month = date.toLocaleString("default", { month: "long" });
		const year = date.getFullYear();

		// Get day suffix
		const suffix = (n: number) => {
			if (n > 3 && n < 21) return "th"; // special case: 11th, 12th, 13th
			switch (n % 10) {
				case 1:
					return "st";
				case 2:
					return "nd";
				case 3:
					return "rd";
				default:
					return "th";
			}
		};

		return `${month} ${day}${suffix(day)}, ${year}`;
	};

	const handleDateSelection = (day: any) => {
		const dateString = day.dateString;
		setSelectedCalendarDate(dateString);
		const tasksForDate = getTasksForDate(dateString);
		console.log("Selected day:", dateString);
		console.log(
			"Task IDs for selected date:",
			tasksForDate.map((task) => task.id)
		);
	};

	// format date YYYY-MM-DD for the calendar
	const formatDateToString = (date: Date) => {
		return `${date.getFullYear()}-${(date.getMonth() + 1)
			.toString()
			.padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
	};

	//get dAYS IN THE MONTH helper
	const getDaysInMonth = (year: number, month: number) =>
		new Date(year, month + 1, 0).getDate();

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
				dateString: formatDateToString(date),
			});
		}

		// Add days from current month
		for (let i = 1; i <= daysInMonth; i++) {
			// 1 to 31
			const date = new Date(year, month, i);
			currentWeek.push({
				day: i,
				date,
				currentMonth: true,
				dateString: formatDateToString(date),
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
					dateString: formatDateToString(date),
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
		setCurrentMonth(newDate.toLocaleString("default", { month: "long" }));
		setCurrentYear(newDate.getFullYear().toString());
	};

	const goToNextMonth = () => {
		const newDate = new Date(viewDate);
		newDate.setMonth(newDate.getMonth() + 1);
		setViewDate(newDate);
		setCurrentMonth(newDate.toLocaleString("default", { month: "long" }));
		setCurrentYear(newDate.getFullYear().toString());
	};

	// Initialize current month and year on component mount
	useEffect(() => {
		const now = new Date();
		setViewDate(now);
		setCurrentMonth(now.toLocaleString("default", { month: "long" }));
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
		} catch (error) {
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

	// Set initial calendar date when component mounts
	useEffect(() => {
		setSelectedCalendarDate(formattedToday);
	}, [formattedToday]);

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: "Calendar",
					headerRight: () => (
						<View className="dark:bg-transparent bg-transparent flex-row">
							<TouchableOpacity
								onPress={() => setModalVisible(true)}
							>
								<Text className="font-semibold text-lg color-iguana-600 web:mr-4 dark:color-iguana-400">
									New
								</Text>
							</TouchableOpacity>
						</View>
					),
				}}
			/>
			{Platform.OS === "web" ? (
				<Head>
					<title>Calendar | Wick</title>
				</Head>
			) : null}
			<View className="flex-1 bg-white dark:bg-oxford-500">
				<SafeAreaView className="h-full pb-0 flex-1 flex flex-col web:max-w-3xl web:mx-auto justify-start dark:bg-oxford-500 bg-white">
					<Calendar
						current={selectedCalendarDate || formattedToday}
						onDayPress={handleDateSelection}
						markingType="multi-dot"
						markedDates={generateMarkedDates()}
						className="mb-4"
						style={{
							...(Platform.OS === "web" && {
								maxWidth: 1000,
								minWidth: 600,
								alignSelf: "center",
							}),
							backgroundColor:
								colorScheme === "dark" ? "#2E3443" : "#ffffff",
							marginBottom: 10,
							...(Platform.OS === "ios" && { marginTop: -60 }), // iOS specific padding
							...(Platform.OS === "android" && {
								marginTop: -25,
							}), // Android specific padding
						}}
						theme={{
							monthTextColor:
								colorScheme === "dark" ? "#fff" : "#000",
							dayTextColor:
								colorScheme === "dark" ? "#fff" : "#000",
							calendarBackground:
								colorScheme === "dark" ? "#2E3443" : "#ffffff",
						}}
					/>

					{/* Tasks for selected date */}
					<View className="flex-1 bg-white dark:bg-oxford-400">
						<Text className="w-full text-lg text-center web:rounded-t-lg py-2 bg-gray-300 dark:bg-oxford-600 font-bold">
							Tasks for{" "}
							{selectedCalendarDate
								? formatDate(new Date(selectedCalendarDate))
								: "Today"}
						</Text>

						{getTasksForSelectedDate().length === 0 ? (
							<View className="flex-1 items-center justify-center bg-white dark:bg-oxford-400">
								<Text className="text-lg text-gray-500">
									There are no tasks for this date.
								</Text>
							</View>
						) : (
							<FlatList
								className="h-full pt-2 px-2"
								data={getTasksForSelectedDate()}
								keyExtractor={(item) => item.id}
								renderItem={({ item }) => (
									<View
										className="mb-3 p-3 rounded-lg flex-row items-center justify-between"
										style={{
											backgroundColor:
												colorScheme === "dark"
													? categories[item.category]
															?.bgdark ||
													  "#4A4A4A"
													: categories[item.category]
															?.bg || "#f5f5f5",
											opacity: item.completed ? 0.7 : 1,
										}}
									>
										{/* Completion Checkbox */}
										<TouchableOpacity
											className="mr-2"
											onPress={() =>
												handleToggleTask(item.id)
											}
										>
											<View
												style={{
													width: 24,
													height: 24,
													borderRadius: 6,
													borderWidth: 2,
													borderColor:
														categories[
															item.category
														]?.border || "#ccc",
													backgroundColor:
														item.completed
															? categories[
																	item
																		.category
															  ]?.border
															: "white",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												{item.completed && (
													<FontAwesome
														name="check"
														size={16}
														color="white"
													/>
												)}
											</View>
										</TouchableOpacity>

										<View className="flex-1">
											<View className="flex-row items-center">
												<View
													className="w-3 h-3 rounded-full mr-2"
													style={{
														backgroundColor:
															categories[
																item.category
															]?.dot || "#999",
													}}
												/>
												<Text
													className={`font-semibold ${
														item.completed
															? "line-through text-gray-500"
															: ""
													}`}
												>
													{item.name}
												</Text>
											</View>

											{item.note ? (
												<Text
													className={`text-gray-600 ml-5 mt-1 ${
														item.completed
															? "line-through"
															: ""
													}`}
												>
													{item.note}
												</Text>
											) : null}

											{item.startTime || item.endTime ? (
												<Text className="text-gray-600 ml-5 mt-1">
													{item.startTime}{" "}
													{item.endTime
														? `- ${item.endTime}`
														: ""}
												</Text>
											) : null}
										</View>

										<TouchableOpacity
											onPress={() =>
												handleDeleteTask(item.id)
											}
										>
											<FontAwesome
												className="mr-2"
												name="trash-o"
												size={24}
												color="#ff6b6b"
											/>
										</TouchableOpacity>
									</View>
								)}
							/>
						)}
					</View>

					{/* task creation modal */}
					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible}
						onRequestClose={handleCloseModal}
					>
						<SafeAreaView className="flex-1 justify-center items-center bg-black/50">
							<View className="bg-white dark:bg-oxford-500 web:max-w-3xl web:mx-auto rounded-lg w-11/12 max-h-2/3">
								{/* Close button at top right */}
								<View className="absolute top-2 right-2 z-10">
									<TouchableOpacity
										className="p-2"
										onPress={handleCloseModal}
									>
										<FontAwesome
											name="close"
											size={24}
											color="#666"
										/>
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
										<TouchableOpacity
											onPress={goToPreviousMonth}
										>
											<FontAwesome
												name="chevron-left"
												size={24}
												color="#666"
											/>
										</TouchableOpacity>

										<View className="items-center">
											<Text className="text-lg font-bold">
												{currentMonth}
											</Text>
											<Text className="text-sm text-gray-500">
												{currentYear}
											</Text>
										</View>

										<TouchableOpacity
											onPress={goToNextMonth}
										>
											<FontAwesome
												name="chevron-right"
												size={24}
												color="#666"
											/>
										</TouchableOpacity>
									</View>

									{/* Mini Calendar */}
									<View className="px-4 pb-2">
										<View className="flex-row justify-between mb-2">
											<Text className="text-center text-gray-500 flex-1">
												Mon
											</Text>
											<Text className="text-center text-gray-500 flex-1">
												Tue
											</Text>
											<Text className="text-center text-gray-500 flex-1">
												Wed
											</Text>
											<Text className="text-center text-gray-500 flex-1">
												Thu
											</Text>
											<Text className="text-center text-gray-500 flex-1">
												Fri
											</Text>
											<Text className="text-center text-gray-500 flex-1">
												Sat
											</Text>
											<Text className="text-center text-gray-500 flex-1">
												Sun
											</Text>
										</View>

										{/*Dynamic Calendar Dates*/}
										{generateCalendarDays().map(
											(week, weekIndex) => (
												<View
													key={`week-${weekIndex}`}
													className="flex-row justify-between mb-2"
												>
													{week.map(
														(day, dayIndex) => (
															<TouchableOpacity
																key={`day-${weekIndex}-${dayIndex}`}
																className="items-center flex-1"
																onPress={() =>
																	setSelectedDate(
																		day.dateString
																	)
																}
															>
																<View
																	className={`${
																		selectedDate ===
																		day.dateString
																			? "bg-purple-600"
																			: "bg-white dark:bg-gray-600"
																	} 
													rounded-full w-8 h-8 items-center justify-center`}
																>
																	<Text
																		className={`${
																			selectedDate ===
																			day.dateString
																				? "text-white"
																				: day.currentMonth
																				? "text-black dark:text-gray-400"
																				: "text-gray-400 dark:text-gray-400"
																		}`}
																	>
																		{
																			day.day
																		}
																	</Text>
																</View>
															</TouchableOpacity>
														)
													)}
												</View>
											)
										)}
									</View>

									{/* Form Fields */}
									<View className="p-4">
										{/* Task Name */}
										<View className="mb-4">
											<TextInput
												className="border-b text-black dark:text-white border-gray-200 dark:border-gray-400 py-2"
												placeholder="Task name"
												value={taskName}
												onChangeText={setTaskName}
											/>
										</View>

										{/* Task Note */}
										<View className="mb-4">
											<TextInput
												className="border-b text-black dark:text-white border-gray-200 dark:border-gray-400 py-2"
												placeholder="Type the note here..."
												value={taskNote}
												onChangeText={setTaskNote}
												multiline
											/>
										</View>

										{/* Time Pickers */}
										<View className="mb-4 flex-row justify-between">
											<View className="flex-1 mr-2">
												<Text className="text-gray-500 mb-1">
													Start time
												</Text>
												<TouchableOpacity className="flex-row items-center border-b border-gray-200 dark:border-gray-400 py-2">
													<TextInput
														placeholder="HH:MM"
														value={startTime}
														onChangeText={
															setStartTime
														}
														className="flex-1 text-black dark:text-white"
													/>
													<FontAwesome
														name="clock-o"
														size={20}
														color="#666"
													/>
												</TouchableOpacity>
											</View>
											<View className="flex-1 ml-2">
												<Text className="text-gray-500 mb-1">
													End time
												</Text>
												<TouchableOpacity className="flex-row items-center border-b border-gray-200 dark:border-gray-400 py-2">
													<TextInput
														placeholder="HH:MM"
														value={endTime}
														onChangeText={
															setEndTime
														}
														className="flex-1 text-black dark:text-white"
													/>
													<FontAwesome
														name="clock-o"
														size={20}
														color="#666"
													/>
												</TouchableOpacity>
											</View>
										</View>

										{/* Reminder Toggle // not working */}
										{/* <View className="mb-4 flex-row justify-between items-center"> */}
										{/* 	<Text className="text-gray-700 dark:text-gray-300"> */}
										{/* 		Remind me */}
										{/* 	</Text> */}
										{/* 	<Switch */}
										{/* 		value={reminderEnabled} */}
										{/* 		onValueChange={setReminderEnabled} */}
										{/* 		trackColor={{ */}
										{/* 			false: "#e9e9e9", */}
										{/* 			true: "#e9e9e9", */}
										{/* 		}} */}
										{/* 		thumbColor={reminderEnabled ? "#6c5ce7" : "#f4f3f4"} */}
										{/* 	/> */}
										{/* </View> */}

										{/* category selection */}
										<Text className="text-gray-700 mb-2">
											Select category
										</Text>
										<View className="flex-row flex-wrap mb-4">
											{Object.keys(categories).map(
												(categoryName) => (
													<TouchableOpacity
														key={categoryName}
														className={`flex-row items-center rounded-full py-2 mr-2 mb-2 ${
															selectedCategory ===
															categoryName
																? `border border-${categories[categoryName].border}`
																: ""
														}`}
														style={{
															backgroundColor:
																colorScheme ===
																"dark"
																	? categories[
																			categoryName
																	  ]
																			.bgdark ||
																	  "#4A4A4A"
																	: categories[
																			categoryName
																	  ].bg,
															borderColor:
																selectedCategory ===
																categoryName
																	? categories[
																			categoryName
																	  ].border
																	: "transparent",
															borderWidth:
																selectedCategory ===
																categoryName
																	? 1
																	: 0,
														}}
														onPress={() =>
															setSelectedCategory(
																categoryName
															)
														}
													>
														<View
															className="w-4 h-4 rounded-full mx-2"
															style={{
																backgroundColor:
																	categories[
																		categoryName
																	].dot,
															}}
														/>
														<Text
															className={
																colorScheme ===
																"dark"
																	? "text-white mr-4"
																	: "text-black mr-4"
															}
														>
															{categoryName}
														</Text>
													</TouchableOpacity>
												)
											)}
										</View>

										{/* Add New Category */}
										<TouchableOpacity
											className="flex-row items-center mb-4"
											onPress={() =>
												setModalVisible(true)
											}
										>
											<Text className="text-purple-600 dark:text-purple-400 ml-2">
												+ Add new
											</Text>
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
									</View>
								</ScrollView>
							</View>
						</SafeAreaView>
					</Modal>
				</SafeAreaView>
			</View>
		</>
	);
};

export default CalendarScreen;
