import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { DesignCustomization, BodyShape, StylePreference } from "../../../shared/types";

// Definicja stanu i akcji dla reducera
interface DesignState extends DesignCustomization {
	bodyShape: BodyShape | null;
	stylePreferences: StylePreference[];
}

type Action =
	| { type: "SET_DESIGN_NAME"; payload: string }
	| { type: "SET_BRIEF"; payload: { bodyShape: BodyShape; preferences: StylePreference[] } }
	| { type: "SELECT_BASE_PRODUCT"; payload: string }
	| { type: "SELECT_VARIANT"; payload: { propertyId: string; variantId: string } }
	| { type: "SET_MEASUREMENT"; payload: { name: string; value: number } }
	| { type: "RESET_DESIGN" };

const initialState: DesignState = {
	designName: null,
	bodyShape: null,
	stylePreferences: [],
	baseProductId: null,
	selectedVariants: {},
	measurements: {},
};

const DesignContext = createContext<
	| {
			state: DesignState;
			dispatch: React.Dispatch<Action>;
	  }
	| undefined
>(undefined);

function designReducer(state: DesignState, action: Action): DesignState {
	switch (action.type) {
		case "SET_DESIGN_NAME":
			return { ...state, designName: action.payload };
		case "SET_BRIEF":
			return { ...state, bodyShape: action.payload.bodyShape, stylePreferences: action.payload.preferences };
		case "SELECT_BASE_PRODUCT":
			return { ...state, baseProductId: action.payload };
		case "SELECT_VARIANT":
			return {
				...state,
				selectedVariants: {
					...state.selectedVariants,
					[action.payload.propertyId]: action.payload.variantId,
				},
			};
		case "SET_MEASUREMENT":
			return {
				...state,
				measurements: {
					...state.measurements,
					[action.payload.name]: action.payload.value,
				},
			};
		case "RESET_DESIGN":
			return initialState;
		default:
			return state;
	}
}

export const DesignProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(designReducer, initialState);
	return <DesignContext.Provider value={{ state, dispatch }}>{children}</DesignContext.Provider>;
};

export const useDesign = () => {
	const context = useContext(DesignContext);
	if (context === undefined) {
		throw new Error("useDesign must be used within a DesignProvider");
	}
	return context;
};
