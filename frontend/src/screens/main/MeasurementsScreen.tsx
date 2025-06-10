import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../../styles/designTokens';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import Card from '../../components/Card';
import { useAuth } from '../../services/auth';

/**
 * MeasurementsScreen component based on the provided design
 * This screen allows users to input and visualize body measurements
 */
const MeasurementsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = React.useState({
    waist: '74',
    chest: '',
    hips: '',
    shoulders: '',
    neck: '',
    inseam: '',
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadUserMeasurements();
  }, []);

  const loadUserMeasurements = async () => {
    try {
      // Load user measurements from API
      // For now, using mock data
      setMeasurements({
        waist: '74',
        chest: '90',
        hips: '95',
        shoulders: '42',
        neck: '36',
        inseam: '78',
      });
    } catch (error) {
      console.error('Error loading measurements:', error);
    }
  };

  const handleMeasurementChange = (field, value) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save measurements to API
      console.log('Saving measurements:', measurements);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving measurements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Toggle edit mode or navigate to edit screen
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>MEASUREMENT</Text>

      {/* Body visualization with measurement points */}
      <View style={styles.bodyContainer}>
        <View style={styles.bodyOutline}>
          {/* Simplified body outline using shapes */}
          <View style={styles.bodyShape}>
            {/* Head */}
            <View style={styles.head} />
            
            {/* Torso */}
            <View style={styles.torso}>
              {/* Waist line */}
              <View style={styles.waistLine}>
                <Text style={styles.waistLabel}>WAIST</Text>
              </View>
            </View>
            
            {/* Legs */}
            <View style={styles.legs} />
          </View>
        </View>
        
        {/* Measurement points */}
        <TouchableOpacity style={[styles.measurementPoint, styles.neckPoint]}>
          <View style={styles.pointInner} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.measurementPoint, styles.chestPoint]}>
          <View style={styles.pointInner} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.measurementPoint, styles.shoulderPoint]}>
          <View style={styles.pointInner} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.measurementPoint, styles.waistPoint]}>
          <Text style={styles.measurementValue}>{measurements.waist}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.measurementPoint, styles.hipLeftPoint]}>
          <View style={styles.pointInner} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.measurementPoint, styles.hipRightPoint]}>
          <View style={styles.pointInner} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.measurementPoint, styles.legPoint]}>
          <View style={styles.pointInner} />
        </TouchableOpacity>
      </View>

      {/* Measurements form */}
      <Card style={styles.measurementsCard}>
        <Text style={styles.cardTitle}>Wprowadź wymiary (cm)</Text>
        
        <FormField
          label="Obwód talii"
          value={measurements.waist}
          onChangeText={(value) => handleMeasurementChange('waist', value)}
          placeholder="74"
          keyboardType="numeric"
        />
        
        <FormField
          label="Obwód klatki piersiowej"
          value={measurements.chest}
          onChangeText={(value) => handleMeasurementChange('chest', value)}
          placeholder="90"
          keyboardType="numeric"
        />
        
        <FormField
          label="Obwód bioder"
          value={measurements.hips}
          onChangeText={(value) => handleMeasurementChange('hips', value)}
          placeholder="95"
          keyboardType="numeric"
        />
        
        <FormField
          label="Szerokość ramion"
          value={measurements.shoulders}
          onChangeText={(value) => handleMeasurementChange('shoulders', value)}
          placeholder="42"
          keyboardType="numeric"
        />
        
        <FormField
          label="Obwód szyi"
          value={measurements.neck}
          onChangeText={(value) => handleMeasurementChange('neck', value)}
          placeholder="36"
          keyboardType="numeric"
        />
        
        <FormField
          label="Długość nogawki"
          value={measurements.inseam}
          onChangeText={(value) => handleMeasurementChange('inseam', value)}
          placeholder="78"
          keyboardType="numeric"
        />
      </Card>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <Button 
          variant="primary" 
          onPress={handleSave}
          style={styles.saveButton}
          disabled={loading}
        >
          {loading ? 'ZAPISYWANIE...' : 'SAVE'}
        </Button>
        
        <Button 
          variant="secondary" 
          onPress={handleEdit}
          style={styles.editButton}
        >
          EDIT
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    fontFamily: typography.fontFamily,
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginLeft: spacing.md,
  },
  bodyContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: spacing.lg,
  },
  bodyOutline: {
    width: '80%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyShape: {
    alignItems: 'center',
  },
  head: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.beige,
    marginBottom: spacing.sm,
  },
  torso: {
    width: 120,
    height: 180,
    backgroundColor: colors.beige,
    borderRadius: spacing.md,
    position: 'relative',
    marginBottom: spacing.sm,
  },
  legs: {
    width: 80,
    height: 120,
    backgroundColor: colors.beige,
    borderRadius: spacing.md,
  },
  waistLine: {
    position: 'absolute',
    width: '120%',
    height: 2,
    backgroundColor: colors.primary,
    top: '50%',
    left: '-10%',
  },
  waistLabel: {
    position: 'absolute',
    left: -spacing.xl,
    top: -spacing.lg,
    fontFamily: typography.fontFamily,
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
  },
  measurementPoint: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.cardBackground,
  },
  neckPoint: {
    top: '15%',
  },
  chestPoint: {
    top: '30%',
    left: '40%',
  },
  shoulderPoint: {
    top: '30%',
    right: '30%',
  },
  waistPoint: {
    top: '50%',
    backgroundColor: colors.brown,
  },
  hipLeftPoint: {
    top: '65%',
    left: '30%',
  },
  hipRightPoint: {
    top: '65%',
    right: '30%',
  },
  legPoint: {
    bottom: '15%',
  },
  measurementValue: {
    fontFamily: typography.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.cardBackground,
  },
  measurementsCard: {
    margin: spacing.md,
  },
  cardTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  saveButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  editButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
});

export default MeasurementsScreen;

