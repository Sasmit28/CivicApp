import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const ReportScreen = ({ navigation }) => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 19.0760,
    longitude: 72.8777,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    reported: true,
    inProgress: true,
    fixed: true,
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Mock complaint data - replace with real data from your backend
  const complaints = [
    {
      id: 1,
      title: 'Pothole on MG Road',
      status: 'reported',
      latitude: 19.0760,
      longitude: 72.8777,
      description: 'Large pothole causing traffic issues',
      reportedBy: 'John Doe',
      date: '2024-01-15',
      type: 'Pothole',
    },
    {
      id: 2,
      title: 'Broken Streetlight',
      status: 'inProgress',
      latitude: 19.0850,
      longitude: 72.8650,
      description: 'Streetlight not working since last week',
      reportedBy: 'Jane Smith',
      date: '2024-01-12',
      type: 'Streetlights',
    },
    {
      id: 3,
      title: 'Garbage Collection Issue',
      status: 'fixed',
      latitude: 19.0650,
      longitude: 72.8900,
      description: 'Garbage not collected for 3 days',
      reportedBy: 'Mike Johnson',
      date: '2024-01-10',
      type: 'Garbage',
    },
    {
      id: 4,
      title: 'Water Leakage',
      status: 'reported',
      latitude: 19.0900,
      longitude: 72.8600,
      description: 'Water pipe leaking on street',
      reportedBy: 'Sarah Wilson',
      date: '2024-01-14',
      type: 'Others',
    },
    {
      id: 5,
      title: 'Road Construction Delay',
      status: 'inProgress',
      latitude: 19.0700,
      longitude: 72.8800,
      description: 'Road work blocking traffic',
      reportedBy: 'Alex Brown',
      date: '2024-01-13',
      type: 'Others',
    },
    {
      id: 6,
      title: 'Park Maintenance',
      status: 'fixed',
      latitude: 19.0800,
      longitude: 72.8750,
      description: 'Park benches needed repair',
      reportedBy: 'Emma Davis',
      date: '2024-01-08',
      type: 'Others',
    },
  ];

  const getMarkerColor = (status) => {
    switch (status) {
      case 'reported':
        return '#FF5722'; // Red
      case 'inProgress':
        return '#2196F3'; // Blue
      case 'fixed':
        return '#4CAF50'; // Green
      default:
        return '#FF5722';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'reported':
        return 'Reported';
      case 'inProgress':
        return 'In Progress';
      case 'fixed':
        return 'Fixed';
      default:
        return 'Unknown';
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    return activeFilters[complaint.status];
  });

  const toggleFilter = (filter) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} tint="dark" style={styles.filterModal}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filter Complaints</Text>
            <TouchableOpacity
              onPress={() => setShowFilters(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[styles.filterOption, activeFilters.reported && styles.filterOptionActive]}
              onPress={() => toggleFilter('reported')}
            >
              <View style={[styles.filterDot, { backgroundColor: '#FF5722' }]} />
              <Text style={styles.filterOptionText}>Reported ({complaints.filter(c => c.status === 'reported').length})</Text>
              <Ionicons 
                name={activeFilters.reported ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={activeFilters.reported ? "#FF6B35" : "#B0B0B0"} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, activeFilters.inProgress && styles.filterOptionActive]}
              onPress={() => toggleFilter('inProgress')}
            >
              <View style={[styles.filterDot, { backgroundColor: '#2196F3' }]} />
              <Text style={styles.filterOptionText}>In Progress ({complaints.filter(c => c.status === 'inProgress').length})</Text>
              <Ionicons 
                name={activeFilters.inProgress ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={activeFilters.inProgress ? "#FF6B35" : "#B0B0B0"} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, activeFilters.fixed && styles.filterOptionActive]}
              onPress={() => toggleFilter('fixed')}
            >
              <View style={[styles.filterDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.filterOptionText}>Fixed ({complaints.filter(c => c.status === 'fixed').length})</Text>
              <Ionicons 
                name={activeFilters.fixed ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={activeFilters.fixed ? "#FF6B35" : "#B0B0B0"} 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </Modal>
  );

  const ComplaintDetailsModal = () => (
    <Modal
      visible={!!selectedComplaint}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setSelectedComplaint(null)}
    >
      {selectedComplaint && (
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} tint="dark" style={styles.detailsModal}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>{selectedComplaint.title}</Text>
              <TouchableOpacity
                onPress={() => setSelectedComplaint(null)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.detailsContent}>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: getMarkerColor(selectedComplaint.status) }
                ]}>
                  <Text style={styles.statusText}>{getStatusText(selectedComplaint.status)}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={20} color="#FF6B35" />
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>{selectedComplaint.type}</Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={20} color="#FF6B35" />
                <Text style={styles.detailLabel}>Reported:</Text>
                <Text style={styles.detailValue}>{selectedComplaint.date}</Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={20} color="#FF6B35" />
                <Text style={styles.detailLabel}>Reporter:</Text>
                <Text style={styles.detailValue}>{selectedComplaint.reportedBy}</Text>
              </View>

              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>Description:</Text>
                <Text style={styles.descriptionText}>{selectedComplaint.description}</Text>
              </View>
            </View>
          </BlurView>
        </View>
      )}
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <BlurView intensity={20} tint="dark" style={styles.header}>
        <Text style={styles.headerTitle}>Report Issue</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="filter-outline" size={24} color="#FF6B35" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            <Ionicons name="locate-outline" size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Map */}
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {filteredComplaints.map((complaint) => (
          <Marker
            key={complaint.id}
            coordinate={{
              latitude: complaint.latitude,
              longitude: complaint.longitude,
            }}
            pinColor={getMarkerColor(complaint.status)}
            onPress={() => setSelectedComplaint(complaint)}
          >
            <View style={[
              styles.customMarker,
              { backgroundColor: getMarkerColor(complaint.status) }
            ]}>
              <Ionicons 
                name="location" 
                size={20} 
                color="#FFFFFF" 
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Legend */}
      <BlurView intensity={20} tint="dark" style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF5722' }]} />
          <Text style={styles.legendText}>Reported</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>In Progress</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Fixed</Text>
        </View>
      </BlurView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Home')}
      >
        <BlurView intensity={15} tint="light" style={styles.fabBlur}>
          <Ionicons name="add" size={28} color="#FF6B35" />
        </BlurView>
      </TouchableOpacity>

      <FilterModal />
      <ComplaintDetailsModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  filterButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
  },
  locationButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  legend: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabBlur: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModal: {
    width: '85%',
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  filterOptions: {
    gap: 16,
    marginBottom: 24,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterOptionActive: {
    borderColor: 'rgba(255, 107, 53, 0.5)',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  filterDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  filterOptionText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsModal: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 16,
  },
  detailsContent: {
    gap: 16,
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    color: '#B0B0B0',
    fontSize: 16,
    fontWeight: '500',
    minWidth: 80,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionLabel: {
    color: '#B0B0B0',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ReportScreen;