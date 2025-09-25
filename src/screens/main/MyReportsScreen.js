import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const MyReportsScreen = ({ navigation }) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Issues');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(null); // New state for status filtering

  // Mock data - replace with real data from your backend
  const reports = [
    {
      id: 1,
      title: 'Pothole',
      description: 'Large pothole on Main Street causing traffic issues',
      location: 'Main Street, Downtown',
      date: '2024-12-19',
      status: 'In-Progress',
      icon: 'car-outline',
    },
    {
      id: 2,
      title: 'Pothole',
      description: 'Large pothole on Main Street causing traffic issues',
      location: 'Main Street, Downtown',
      date: '2024-12-19',
      status: 'Completed',
      icon: 'car-outline',
    },
    {
      id: 3,
      title: 'Street light',
      description: 'Large pothole on Main Street causing traffic issues',
      location: 'Main Street, Downtown',
      date: '2024-12-19',
      status: 'Under Review',
      icon: 'bulb-outline',
    },
    {
      id: 4,
      title: 'Garbage',
      description: 'Large pothole on Main Street causing traffic issues',
      location: 'Main Street, Downtown',
      date: '2024-12-19',
      status: 'In-Progress',
      icon: 'trash-outline',
    },
    {
      id: 5,
      title: 'Street Lights',
      description: 'Large pothole on Main Street causing traffic issues',
      location: 'Main Street, Downtown',
      date: '2024-12-19',
      status: 'Pending',
      icon: 'bulb-outline',
    },
    {
      id: 6,
      title: 'Garbage',
      description: 'Large pothole on Main Street causing traffic issues',
      location: 'Main Street, Downtown',
      date: '2024-12-19',
      status: 'In-Progress',
      icon: 'trash-outline',
    },
    {
      id: 7,
      title: 'Pothole',
      description: 'Large pothole on Main Street causing traffic issues',
      location: 'Main Street, Downtown',
      date: '2024-12-19',
      status: 'Completed',
      icon: 'car-outline',
    },
  ];

  const getStatusCounts = () => {
    const pending = reports.filter(r => r.status === 'Pending').length;
    const inProgress = reports.filter(r => r.status === 'In-Progress').length;
    const completed = reports.filter(r => r.status === 'Completed').length;
    return { pending, inProgress, completed };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#FF5722'; // Red
      case 'In-Progress':
        return '#2196F3'; // Yellow/Orange
      case 'Under Review':
        return '#FFC107'; // Blue
      case 'Completed':
        return '#4CAF50'; // Green
      default:
        return '#FF5722';
    }
  };

  const getCardBackgroundColor = (status) => {
    return 'rgba(255, 255, 255, 0.1)'; // Consistent glassmorphism background
  };

  const getFilteredReports = () => {
    let filteredReports = reports;

    // Filter by category first
    if (selectedCategoryFilter !== 'All Issues') {
      const categoryMap = {
        'Pothole': 'Pothole',
        'Garbage': 'Garbage',
        'Streetlight': ['Street light', 'Street Lights'] // Handle both variations
      };

      if (selectedCategoryFilter === 'Streetlight') {
        filteredReports = filteredReports.filter(report => 
          categoryMap.Streetlight.includes(report.title)
        );
      } else {
        filteredReports = filteredReports.filter(report => 
          report.title === categoryMap[selectedCategoryFilter]
        );
      }
    }

    // Then filter by status if a status filter is selected
    if (selectedStatusFilter) {
      const statusMap = {
        'Pending': 'Pending',
        'In Progress': 'In-Progress',
        'Completed': 'Completed'
      };
      
      filteredReports = filteredReports.filter(report => 
        report.status === statusMap[selectedStatusFilter]
      );
    }

    return filteredReports;
  };

  const { pending, inProgress, completed } = getStatusCounts();
  const categoryFilters = ['Pothole', 'Garbage', 'Streetlight', 'All Issues']; // Updated to category filters

  return (
    <ImageBackground
      source={require('../../../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reports</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Statistics Cards */}
          <View style={styles.statsContainer}>
            <TouchableOpacity 
              style={[
                styles.statCard, 
                { backgroundColor: 'rgba(255, 87, 34, 0.8)' },
                selectedStatusFilter === 'Pending' && styles.selectedStatCard
              ]}
              onPress={() => setSelectedStatusFilter(selectedStatusFilter === 'Pending' ? null : 'Pending')}
            >
              <Text style={styles.statNumber}>{pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.statCard, 
                { backgroundColor: 'rgba(7, 152, 255, 0.8)' },
                selectedStatusFilter === 'In Progress' && styles.selectedStatCard
              ]}
              onPress={() => setSelectedStatusFilter(selectedStatusFilter === 'In Progress' ? null : 'In Progress')}
            >
              <Text style={styles.statNumber}>{inProgress}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.statCard, 
                { backgroundColor: 'rgba(76, 175, 80, 0.8)' },
                selectedStatusFilter === 'Completed' && styles.selectedStatCard
              ]}
              onPress={() => setSelectedStatusFilter(selectedStatusFilter === 'Completed' ? null : 'Completed')}
            >
              <Text style={styles.statNumber}>{completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            {categoryFilters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedCategoryFilter === filter && styles.filterButtonActive
                ]}
                onPress={() => setSelectedCategoryFilter(filter)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedCategoryFilter === filter && styles.filterButtonTextActive
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Reports List */}
          <View style={styles.reportsContainer}>
            {getFilteredReports().map((report) => (
              <BlurView key={report.id} intensity={20} tint="dark" style={[
                styles.reportCard,
                { backgroundColor: getCardBackgroundColor(report.status) }
              ]}>
                <View style={styles.reportHeader}>
                  <View style={styles.reportTitleContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: getStatusColor(report.status) }]}>
                      <Ionicons name={report.icon} size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.titleSection}>
                      <Text style={styles.reportTitle}>{report.title}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                        <Text style={styles.statusText}>{report.status}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <Text style={styles.reportDescription}>{report.description}</Text>
                
                <View style={styles.reportFooter}>
                  <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={14} color="#B0B0B0" />
                    <Text style={styles.locationText}>{report.location}</Text>
                    <Text style={styles.dateText}>• {report.date}</Text>
                  </View>
                </View>
              </BlurView>
            ))}
          </View>

          {/* Bottom spacing */}
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedStatCard: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  reportsContainer: {
    gap: 16,
  },
  reportCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportHeader: {
    marginBottom: 12,
  },
  reportTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  reportDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    marginBottom: 12,
  },
  reportFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default MyReportsScreen;