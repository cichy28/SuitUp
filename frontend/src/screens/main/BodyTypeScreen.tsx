import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../../styles/designTokens';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';

/**
 * BodyTypeScreen component based on the provided design
 * This screen allows users to select their body type and preferences
 */
const BodyTypeScreen = ({ navigation }) => {
  // State for selected body type and preferences
  const [selectedBodyType, setSelectedBodyType] = React.useState(1);
  const [preferences, setPreferences] = React.useState({
    fittedWear: true,
    oversizeWear: false,
    retroShapes: true,
    masculineShapes: false,
  });

  // Handle body type selection
  const handleBodyTypeSelect = (index) => {
    setSelectedBodyType(index);
  };

  // Handle preference toggle
  const handlePreferenceToggle = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  // Handle finish button press
  const handleFinish = () => {
    navigation.navigate('Home');
  };

  // Body type shapes
  const bodyShapes = [
    { id: 0, shape: 'triangle' },
    { id: 1, shape: 'inverted-triangle' },
    { id: 2, shape: 'hourglass' },
    { id: 3, shape: 'oval' },
    { id: 4, shape: 'rectangle' },
  ];

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBrown} />
        <View style={styles.progressBarMint} />
        <View style={styles.menuButton}>
          <Text style={styles.menuDots}>•••</Text>
        </View>
      </View>

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>BRIEF</Text>
      </View>

      {/* Body type selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>SELECT YOUR BODY TYPE</Text>
        
        <View style={styles.bodyTypesContainer}>
          {/* Body type figures */}
          <View style={styles.figuresRow}>
            {[0, 1, 2, 3, 4].map((index) => (
              <TouchableOpacity 
                key={`figure-${index}`}
                style={styles.figureContainer}
                onPress={() => handleBodyTypeSelect(index)}
              >
                <View style={[
                  styles.figure,
                  selectedBodyType === index && styles.selectedFigure
                ]}>
                  {/* In a real app, these would be actual images */}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Body type shapes */}
          <View style={styles.shapesRow}>
            {bodyShapes.map((shape, index) => (
              <View 
                key={`shape-${index}`}
                style={[
                  styles.shapeContainer,
                  selectedBodyType === index && styles.selectedShapeContainer
                ]}
              >
                <View style={[
                  styles.shape,
                  styles[shape.shape],
                  selectedBodyType === index && styles.selectedShape
                ]} />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>I LIKE</Text>
        
        <View style={styles.preferencesContainer}>
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>FITTED WEAR</Text>
            <Checkbox 
              checked={preferences.fittedWear}
              onPress={() => handlePreferenceToggle('fittedWear')}
            />
          </View>
          
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>OVERSIZE WEAR</Text>
            <Checkbox 
              checked={preferences.oversizeWear}
              onPress={() => handlePreferenceToggle('oversizeWear')}
            />
          </View>
          
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>RETRO SHAPES</Text>
            <Checkbox 
              checked={preferences.retroShapes}
              onPress={() => handlePreferenceToggle('retroShapes')}
            />
          </View>
          
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>MASCULINE SHAPES</Text>
            <Checkbox 
              checked={preferences.masculineShapes}
              onPress={() => handlePreferenceToggle('masculineShapes')}
            />
          </View>
        </View>
      </View>

      {/* Finish button */}
      <View style={styles.buttonContainer}>
        <Button 
          variant="primary" 
          onPress={handleFinish}
          style={styles.finishButton}
        >
          FINISH
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 8,
    width: '100%',
    position: 'relative',
  },
  progressBarBrown: {
    flex: 3,
    backgroundColor: colors.brown,
  },
  progressBarMint: {
    flex: 2,
    backgroundColor: colors.primary,
  },
  menuButton: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
  },
  menuDots: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
  },
  headerContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  headerTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
  },
  sectionContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.cardBackground,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  bodyTypesContainer: {
    alignItems: 'center',
  },
  figuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing.md,
  },
  figureContainer: {
    alignItems: 'center',
  },
  figure: {
    width: 40,
    height: 80,
    backgroundColor: colors.beige,
    borderRadius: borderRadius.md,
  },
  selectedFigure: {
    backgroundColor: colors.primary,
  },
  shapesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  shapeContainer: {
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  shape: {
    width: 40,
    height: 40,
    backgroundColor: colors.beige,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.beige,
  },
  'inverted-triangle': {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderTopWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
  },
  hourglass: {
    width: 30,
    height: 40,
    backgroundColor: colors.beige,
  },
  oval: {
    width: 30,
    height: 40,
    borderRadius: 15,
    backgroundColor: colors.beige,
  },
  rectangle: {
    width: 30,
    height: 40,
    backgroundColor: colors.beige,
  },
  selectedShapeContainer: {},
  selectedShape: {
    backgroundColor: colors.primary,
    borderBottomColor: colors.primary,
    borderTopColor: colors.primary,
  },
  preferencesContainer: {
    marginTop: spacing.sm,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  preferenceLabel: {
    fontFamily: typography.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  finishButton: {
    width: '50%',
  },
});

export default BodyTypeScreen;

