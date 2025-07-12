
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import InteractiveImageView, { HotspotData } from '../components/InteractiveImageView';
import { initialHotspots } from '../components/InteractiveImageView';

const MeasurementScreen = () => {
  const [hotspots, setHotspots] = useState<HotspotData[]>(initialHotspots);

  const handleHotspotPress = (hotspot: HotspotData) => {
    Alert.prompt(
      `Enter Measurement for ${hotspot.name}`,
      'Please enter the value in centimeters.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (value) => {
            if (value) {
              const newHotspots = hotspots.map((h) =>
                h.id === hotspot.id ? { ...h, value } : h
              );
              setHotspots(newHotspots);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <View style={styles.container}>
      <InteractiveImageView
        source={require('../../assets/images/body-measurement.jpg')}
        hotspots={hotspots}
        onHotspotPress={handleHotspotPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MeasurementScreen;
