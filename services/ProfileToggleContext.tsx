import React, { createContext, useContext, useState } from "react";

interface ProfileToggleContextType {
	showImporter: boolean;
	toggleImporter: () => void;
}

const ProfileToggleContext = createContext<
	ProfileToggleContextType | undefined
>(undefined);

export const ProfileToggleProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [showImporter, setShowImporter] = useState(false);

	const toggleImporter = () => {
		setShowImporter((prev) => !prev);
	};

	return (
		<ProfileToggleContext.Provider value={{ showImporter, toggleImporter }}>
			{children}
		</ProfileToggleContext.Provider>
	);
};

export const useProfileToggle = () => {
	const context = useContext(ProfileToggleContext);
	if (context === undefined) {
		throw new Error(
			"useProfileToggle must be used within a ProfileToggleProvider"
		);
	}
	return context;
};
