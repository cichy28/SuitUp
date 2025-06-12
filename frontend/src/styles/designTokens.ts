/**
 * Design Tokens for the Suit Creator App
 * Based on the provided UI designs (JPGs)
 */

export interface Colors {
	primary: string;
	secondary: string;
	accent: string;
	textPrimary: string;
	textSecondary: string;
	background: string;
	cardBackground: string;
	border: string;
	success: string;
	error: string;
	warning: string;
	info: string;
	brown: string;
	beige: string;
	white: string;
	backgroundSecondary: string;
}

export interface TypographyStyle {
	fontSize: number;
	fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
}

export interface Typography {
	fontFamily: string;
	h1: TypographyStyle;
	h2: TypographyStyle;
	h3: TypographyStyle;
	h4: TypographyStyle;
	body: TypographyStyle;
	small: TypographyStyle;
}

export interface Spacing {
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl: number;
}

export interface BorderRadius {
	sm: string;
	md: string;
	lg: string;
	full: string;
}

export interface Shadows {
	sm: string;
	md: string;
}

export interface DesignTokens {
	colors: Colors;
	typography: Typography;
	spacing: Spacing;
	borderRadius: BorderRadius;
	shadows: Shadows;
}

export const colors: Colors = {
	primary: "#4ECDC4", // Mint/Turquoise from buttons and accents
	secondary: "#F7FFF7", // Light background color
	accent: "#FF6B6B", // Reddish accent, not prominent but could be used
	textPrimary: "#333333", // Dark text
	textSecondary: "#666666", // Lighter text
	background: "#F7FFF7", // Main background
	cardBackground: "#FFFFFF", // Card background
	border: "#E0E0E0", // Light border color
	success: "#4ECDC4", // Example success color
	error: "#FF6B6B", // Example error color
	warning: "#FFD166", // Example warning color
	info: "#1E90FF", // Example info color
	brown: "#8B4513", // Brown from progress bar and some elements
	beige: "#F5DEB3", // Beige from body type icons
	white: "#FFFFFF",
	backgroundSecondary: "#FFFFFF",
};

export const typography: Typography = {
	fontFamily: "Arial, sans-serif", // Placeholder, need to identify actual font
	h1: {
		fontSize: 32,
		fontWeight: "bold",
	},
	h2: {
		fontSize: 24,
		fontWeight: "bold",
	},
	h3: {
		fontSize: 20,
		fontWeight: "bold",
	},
	h4: {
		fontSize: 18,
		fontWeight: "bold",
	},
	body: {
		fontSize: 16,
		fontWeight: "normal",
	},
	small: {
		fontSize: 14,
		fontWeight: "normal",
	},
};

export const spacing: Spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
};

export const borderRadius: BorderRadius = {
	sm: "4px",
	md: "8px",
	lg: "12px",
	full: "9999px",
};

export const shadows: Shadows = {
	sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
	md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
};

export const designTokens: DesignTokens = {
	colors,
	typography,
	spacing,
	borderRadius,
	shadows,
};

export default designTokens;
