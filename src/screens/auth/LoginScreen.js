import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isLoading, setIsLoading] = useState(false);

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number validation
    return phoneRegex.test(number);
  };

  const handleSendOTP = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to OTP screen with phone number
      navigation.navigate('OTPScreen', { 
        phoneNumber: `${countryCode}${phoneNumber}` 
      });
    }, 1500);
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/background.jpg')} // You'll need to add the city image here
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header with Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="location-outline" size={40} color="#FF6B35" />
              <Text style={styles.logoText}>CIVIC</Text>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Welcome Card */}
            <BlurView intensity={20} tint="dark" style={styles.glassCard}>
              <Text style={styles.welcomeTitle}>Hi! Welcome to Civic</Text>
              <Text style={styles.welcomeSubtitle}>Create your account</Text>

              {/* Phone Number Input Section */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Enter Your Phone no</Text>
                
                <View style={styles.phoneInputContainer}>
                  {/* Country Code Selector */}
                  <TouchableOpacity style={styles.countryCodeContainer}>
                    <Text style={styles.flagEmoji}>🇮🇳</Text>
                    <Ionicons name="chevron-down" size={16} color="#B0B0B0" />
                  </TouchableOpacity>

                  {/* Phone Number Input */}
                  <TextInput
                    style={styles.phoneInput}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="7487486769"
                    placeholderTextColor="#B0B0B0"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>

                {/* OTP Input Placeholder */}
                <View style={styles.otpSection}>
                  <Text style={styles.inputLabel}>Verify Phone no</Text>
                  <View style={styles.otpContainer}>
                    <Text style={styles.otpLabel}>OTP</Text>
                    <View style={styles.otpInput}>
                      <Text style={styles.otpPlaceholder}>_ _ _ _ _ _</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
                onPress={handleSendOTP}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.signInButtonText}>Sending OTP...</Text>
                ) : (
                  <Text style={styles.signInButtonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </BlurView>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </KeyboardAvoidingView>
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
    backgroundColor: 'rgba(26, 26, 46, 0.7)', // Dark overlay
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  content: {
    flex: 0.7,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  glassCard: {
    borderRadius: 24,
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
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    fontWeight: '500',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 8,
    gap: 8,
  },
  flagEmoji: {
    fontSize: 18,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  otpSection: {
    marginTop: 8,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  otpLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginRight: 8,
  },
  otpInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  otpPlaceholder: {
    color: '#B0B0B0',
    fontSize: 20,
    letterSpacing: 8,
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signInButtonDisabled: {
    backgroundColor: 'rgba(255, 107, 53, 0.6)',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flex: 0.1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  footerText: {
    color: '#B0B0B0',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen;