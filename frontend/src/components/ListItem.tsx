import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../styles/designTokens";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface ListItemProps {
	title: string;
	subtitle?: string;
	leftIcon?: string;
	rightIcon?: string;
	onPress?: () => void;
	chevron?: boolean;
	className?: string;
	titleClassName?: string;
	subtitleClassName?: string;
}

const ListItem: React.FC<ListItemProps> = ({
	title,
	subtitle,
	leftIcon,
	rightIcon,
	onPress,
	chevron = false,
	className = "",
	titleClassName = "",
	subtitleClassName = "",
}) => {
	// Base classes
	let containerClasses = `flex-row items-center py-${spacing.md} px-${spacing.lg} border-b border-border`;
	let contentClasses = `flex-1 ml-${spacing.sm}`;
	let titleClasses = `text-textPrimary font-body`;
	let subtitleClasses = `text-textSecondary text-small mt-${spacing.xs}`;

	// Add custom classes
	containerClasses += ` ${className}`;
	titleClasses += ` ${titleClassName}`;
	subtitleClasses += ` ${subtitleClassName}`;

	return (
		<StyledTouchableOpacity
			className={containerClasses}
			onPress={onPress}
			disabled={!onPress}
			activeOpacity={onPress ? 0.7 : 1}
		>
			{leftIcon && <Ionicons name={leftIcon} size={24} color={colors.primary} />}

			<StyledView className={contentClasses}>
				<StyledText className={titleClasses}>{title}</StyledText>
				{subtitle && <StyledText className={subtitleClasses}>{subtitle}</StyledText>}
			</StyledView>

			{rightIcon && <Ionicons name={rightIcon} size={20} color={colors.textSecondary} />}

			{chevron && <Ionicons name="chevron-forward" size={20} color={colors.border} />}
		</StyledTouchableOpacity>
	);
};

export default ListItem;
