import React from 'react';
import { View, Text, Modal as RNModal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/designTokens';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdropPress = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
}) => {
  // Base classes
  let containerClasses = 'bg-cardBackground rounded-lg overflow-hidden w-5/6 max-w-md';
  let headerClasses = 'px-md py-sm border-b border-border flex-row justify-between items-center';
  let bodyClasses = 'p-md';
  
  // Add custom classes
  containerClasses += ` ${className}`;
  headerClasses += ` ${headerClassName}`;
  bodyClasses += ` ${bodyClassName}`;
  
  return (
    <RNModal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={closeOnBackdropPress ? onClose : undefined}>
        <StyledView className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <TouchableWithoutFeedback>
            <StyledView className={containerClasses}>
              {(title || showCloseButton) && (
                <StyledView className={headerClasses}>
                  <StyledText className="font-h3 text-h3 text-textPrimary">{title || ''}</StyledText>
                  {showCloseButton && (
                    <StyledTouchableOpacity onPress={onClose} className="p-xs">
                      <Ionicons name="close" size={24} color={colors.textSecondary} />
                    </StyledTouchableOpacity>
                  )}
                </StyledView>
              )}
              <StyledView className={bodyClasses}>
                {children}
              </StyledView>
            </StyledView>
          </TouchableWithoutFeedback>
        </StyledView>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

export default Modal;


