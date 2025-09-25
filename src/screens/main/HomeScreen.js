import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const HomeScreen = ({ navigation }) => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [description, setDescription] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
    address: ''
  });
  const [locationLoading, setLocationLoading] = useState(false);

  const issueTypes = [
    { id: 1, label: 'Pothole', icon: 'car-outline' },
    { id: 2, label: 'Streetlights', icon: 'bulb-outline' },
    { id: 3, label: 'Garbage', icon: 'trash-outline' },
    { id: 4, label: 'Others', icon: 'ellipsis-horizontal-outline' }
  ];

  // Request permissions on component mount
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (cameraStatus !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
    }
    
    if (locationStatus !== 'granted') {
      Alert.alert('Permission needed', 'Location permission is required to get coordinates');
    }
  };

  const handleCameraPress = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        Alert.alert('Photo Captured!', 'Your photo has been added to the report');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera: ' + error.message);
    }
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required');
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocoding to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      let address = 'Unknown location';
      if (reverseGeocode.length > 0) {
        const location = reverseGeocode[0];
        address = `${location.name || ''} ${location.street || ''}, ${location.city || ''}, ${location.region || ''}`.trim();
      }

      setCurrentLocation({
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
        address: address
      });

      Alert.alert('Location Updated!', 'Current location has been set');
    } catch (error) {
      Alert.alert('Location Error', 'Failed to get location: ' + error.message);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedIssue) {
      Alert.alert('Missing Information', 'Please select an issue type');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please describe your issue');
      return;
    }
    if (!currentLocation.latitude) {
      Alert.alert('Missing Information', 'Please set your location');
      return;
    }

    Alert.alert(
      'Report Submitted',
      `Your ${selectedIssue.toLowerCase()} report has been submitted successfully!\n\nLocation: ${currentLocation.address}`,
      [{ 
        text: 'OK',
        onPress: () => {
          // Reset form
          setSelectedIssue('');
          setDescription('');
          setCapturedImage(null);
          setCurrentLocation({ latitude: null, longitude: null, address: '' });
        }
      }]
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, Users</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={40} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Camera Section */}
          <View style={styles.cameraSection}>
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={handleCameraPress}
            >
              <BlurView intensity={15} tint="light" style={styles.cameraBlur}>
                {capturedImage ? (
                  <View style={styles.imagePreview}>
                    <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
                    <View style={styles.imageOverlay}>
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    </View>
                  </View>
                ) : (
                  <Ionicons name="camera-outline" size={40} color="#FF6B35" />
                )}
              </BlurView>
            </TouchableOpacity>
            <Text style={styles.cameraText}>Report Your Complain</Text>
          </View>

          {/* Report Form */}
          <BlurView intensity={20} tint="dark" style={styles.formCard}>
            {/* Issue Type Dropdown */}
            <View style={styles.inputGroup}>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <BlurView intensity={25} tint="light" style={styles.dropdownContent}>
                  <View style={styles.dropdownLeft}>
                    {selectedIssue && (
                      <Ionicons 
                        name={issueTypes.find(item => item.label === selectedIssue)?.icon || 'help-outline'} 
                        size={20} 
                        color="#FF6B35" 
                      />
                    )}
                    <Text style={[
                      styles.dropdownText, 
                      selectedIssue ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder
                    ]}>
                      {selectedIssue || 'Select issue'}
                    </Text>
                  </View>
                  <Ionicons 
                    name={showDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#FF6B35" 
                  />
                </BlurView>
              </TouchableOpacity>

              {/* Dropdown Options */}
              {showDropdown && (
                <BlurView intensity={25} tint="dark" style={styles.dropdownMenu}>
                  {issueTypes.map((issue, index) => (
                    <TouchableOpacity
                      key={issue.id}
                      style={[
                        styles.dropdownOption,
                        index < issueTypes.length - 1 && styles.dropdownOptionBorder
                      ]}
                      onPress={() => {
                        setSelectedIssue(issue.label);
                        setShowDropdown(false);
                      }}
                    >
                      <Ionicons name={issue.icon} size={20} color="#FF6B35" />
                      <Text style={styles.dropdownOptionText}>{issue.label}</Text>
                    </TouchableOpacity>
                  ))}
                </BlurView>
              )}
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <BlurView intensity={25} tint="light" style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter Grievance/ Describe you issue"
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </BlurView>
            </View>

            {/* Location Section */}
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={getCurrentLocation}
              disabled={locationLoading}
            >
              <BlurView intensity={25} tint="light" style={styles.locationContent}>
                <View style={styles.locationLeft}>
                  <View style={styles.locationIconContainer}>
                    <Ionicons 
                      name={locationLoading ? "refresh" : "location-outline"} 
                      size={20} 
                      color="#FF6B35" 
                      style={locationLoading ? styles.spinning : null}
                    />
                  </View>
                  <Text style={styles.locationButtonText}>
                    {locationLoading ? 'Getting Location...' : 
                     currentLocation.address ? currentLocation.address : 'Choose Location'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#FF6B35" />
              </BlurView>
            </TouchableOpacity>

            {/* Coordinate Display */}
            {currentLocation.latitude && currentLocation.longitude && (
              <View style={styles.coordinatesContainer}>
                <BlurView intensity={25} tint="light" style={styles.coordinateBox}>
                  <Ionicons name="location" size={16} color="#FF6B35" />
                  <Text style={styles.coordinateLabel}>Latitude</Text>
                  <Text style={styles.coordinateValue}>{currentLocation.latitude}</Text>
                </BlurView>
                
                <BlurView intensity={25} tint="light" style={styles.coordinateBox}>
                  <Ionicons name="navigate" size={16} color="#FF6B35" />
                  <Text style={styles.coordinateLabel}>Longitude</Text>
                  <Text style={styles.coordinateValue}>{currentLocation.longitude}</Text>
                </BlurView>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <BlurView intensity={15} tint="light" style={styles.submitBlur}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </BlurView>
            </TouchableOpacity>
          </BlurView>

          {/* Bottom spacing for scroll */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  cameraSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  cameraButton: {
    marginBottom: 16,
  },
  cameraBlur: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  imagePreview: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 22,
    overflow: 'hidden',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  imageOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 2,
  },
  cameraText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  formCard: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  inputGroup: {
    marginBottom: 20,
    position: 'relative',
  },
  dropdown: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  dropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownText: {
    fontSize: 16,
    marginLeft: 12,
  },
  dropdownTextPlaceholder: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  dropdownTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    zIndex: 1000,
    elevation: 10,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dropdownOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    fontWeight: '500',
  },
  textAreaContainer: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    overflow: 'hidden',
  },
  textArea: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 100,
  },
  locationButton: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  spinning: {
    transform: [{ rotate: '45deg' }],
  },
  locationButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  coordinateBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  coordinateLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 4,
    marginTop: 4,
  },
  coordinateValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  submitButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  submitBlur: {
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default HomeScreen; 