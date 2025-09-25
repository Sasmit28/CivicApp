import React from 'react';
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

const AboutScreen = ({ navigation }) => {
  const appFeatures = [
    {
      title: 'Report Issues',
      description: 'Easily report civic issues like potholes, garbage, and street lights',
      icon: 'create-outline'
    },
    {
      title: 'Track Progress',
      description: 'Monitor the status of your reported issues in real-time',
      icon: 'analytics-outline'
    },
    {
      title: 'Location Services',
      description: 'Automatically capture location for accurate issue reporting',
      icon: 'location-outline'
    },
    {
      title: 'Photo Upload',
      description: 'Add photos to provide visual evidence of civic issues',
      icon: 'camera-outline'
    },
  ];

  return (
    <ImageBackground
      source={require('../../../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>About</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* App Info */}
          <BlurView intensity={20} tint="dark" style={styles.appCard}>
            <View style={styles.appIcon}>
              <Ionicons name="phone-portrait-outline" size={48} color="#FF6B35" />
            </View>
            <Text style={styles.appName}>Civic Issue Reporter</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Your voice matters! Report civic issues in your community and help make your city better. 
              Our app connects citizens with local authorities to address problems quickly and efficiently.
            </Text>
          </BlurView>

          {/* App Features */}
          <Text style={styles.sectionTitle}>Key Features</Text>
          <BlurView intensity={20} tint="dark" style={styles.featuresCard}>
            {appFeatures.map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.featureItem,
                  index < appFeatures.length - 1 && styles.featureBorder
                ]}
              >
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon} size={24} color="#FF6B35" />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </BlurView>

          {/* Mission */}
          <BlurView intensity={20} tint="dark" style={styles.missionCard}>
            <Ionicons name="flag-outline" size={32} color="#FF6B35" />
            <Text style={styles.missionTitle}>Our Mission</Text>
            <Text style={styles.missionDescription}>
              To empower citizens by providing a simple, effective way to report civic issues and collaborate 
              with local authorities to build better, more responsive communities. Together, we can create 
              positive change, one report at a time.
            </Text>
          </BlurView>

          {/* Developer Info */}
          <BlurView intensity={20} tint="dark" style={styles.developerCard}>
            <Text style={styles.developerTitle}>Developed by</Text>
            <Text style={styles.developerName}>Civic Solutions Team</Text>
            <Text style={styles.developerDescription}>
              Built with ❤️ for better communities
            </Text>
          </BlurView>

          {/* Copyright */}
          <View style={styles.copyrightContainer}>
            <Text style={styles.copyrightText}>
              © 2024 Civic Issue Reporter. All rights reserved.
            </Text>
          </View>

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
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  appCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  appVersion: {
    fontSize: 16,
    color: '#FF6B35',
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 8,
  },
  featuresCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 24,
    overflow: 'hidden',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 18,
  },
  featureBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  missionCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  missionDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
  },
  developerCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  developerTitle: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  developerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  developerDescription: {
    fontSize: 14,
    color: '#FF6B35',
    textAlign: 'center',
  },
  copyrightContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  copyrightText: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default AboutScreen;