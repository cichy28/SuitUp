import React, { createContext, useState, ReactNode, useContext } from "react";

// Definicja kształtu wartości kontekstu
interface DesignContextType {
	currentStep: number;
	totalSteps: number;
	selectedVariables: { [key: string]: string };
	handleVariableChange: (propertyId: string, value: string) => void;
	goToNextStep: () => void;
	goToPreviousStep: () => void;
}

// Stworzenie kontekstu z początkową wartością undefined
export const DesignContext = createContext<DesignContextType | undefined>(undefined);

// Definicja propsów dla komponentu providera
interface DesignProviderProps {
	children: ReactNode;
}

// Stworzenie komponentu providera
export const DesignProvider: React.FC<DesignProviderProps> = ({ children }) => {
	const [currentStep, setCurrentStep] = useState(1);
	const [selectedVariables, setSelectedVariables] = useState<{
		[key: string]: string;
	}>({});
	const totalSteps = 5; // Przykładowa liczba kroków

	const handleVariableChange = (propertyId: string, value: string) => {
		setSelectedVariables((prev) => ({ ...prev, [propertyId]: value }));
	};

	const goToNextStep = () => {
		setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
	};

	const goToPreviousStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	return (
		<DesignContext.Provider
			value={{
				currentStep,
				totalSteps,
				selectedVariables,
				handleVariableChange,
				goToNextStep,
				goToPreviousStep,
			}}
		>
			{children}
		</DesignContext.Provider>
	);
};

// --- POCZĄTEK ZMIANY ---
// Dodanie i wyeksportowanie customowego hooka do używania kontekstu
export const useDesign = () => {
	const context = useContext(DesignContext);
	if (context === undefined) {
		throw new Error("useDesign must be used within a DesignProvider");
	}
	return context;
};
// --- KONIEC ZMIANY ---
