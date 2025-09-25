import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const OTPScreen = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const { login } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // References for OTP inputs
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }

    if (newOtp.every((digit) => digit !== '') && index === 5) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyPress = (key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode = null) => {
    const otpToVerify = otpCode || otp.join('');

    if (otpToVerify.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);

    // Simulate OTP verification
    setTimeout(async () => {
      setIsLoading(false);
      if (otpToVerify.length === 6) {
        // Instead of navigate, call login
        const result = await login(phoneNumber, otpToVerify);
        if (!result.success) {
          Alert.alert('Login failed', result.error || 'Unknown error');
        }
      } else {
        Alert.alert('Invalid OTP', 'Please enter a valid OTP');
      }
    }, 2000);
  };

  const handleResendOTP = () => {
    if (!canResend) return;

    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    otpRefs[0].current?.focus();

    Alert.alert('OTP Sent', 'A new OTP has been sent to your phone number');
  };

  const formatPhoneNumber = (phone) => {
    if (phone.length >= 10) {
      return phone.replace(/(\+\d{2})(\d{5})(\d{5})/, '$1 $2 $3');
    }
    return phone;
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Ionicons name="location-outline" size={32} color="#FF6B35" />
            <Text style={styles.logoText}>CIVIC</Text>
          </View>

          <View style={styles.placeholder} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <BlurView intensity={20} tint="dark" style={styles.glassCard}>
            <Text style={styles.title}>Verify Your Phone</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to{'\n'}
              <Text style={styles.phoneNumber}>
                {formatPhoneNumber(phoneNumber)}
              </Text>
            </Text>

            {/* OTP Input */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={otpRefs[index]}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent: { key } }) =>
                    handleKeyPress(key, index)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Timer and Resend */}
            <View style={styles.resendContainer}>
              {!canResend ? (
                <Text style={styles.timerText}>
                  Resend OTP in {timer}s
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendOTP}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                styles.verifyButton,
                isLoading && styles.verifyButtonDisabled,
              ]}
              onPress={() => handleVerifyOTP()}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.verifyButtonText}>Verifying...</Text>
                </View>
              ) : (
                <Text style={styles.verifyButtonText}>
                  Verify & Continue
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.helpContainer}>
              <Text style={styles.helpText}>
                Didn't receive the code? Check your SMS or try again
              </Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            We'll never share your personal information
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.7)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  placeholder: { width: 40 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  glassCard: {
    borderRadius: 24,
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  phoneNumber: { color: '#FFFFFF', fontWeight: '600' },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 8,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  otpInputFilled: {
    borderColor: '#FF6B35',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  resendContainer: { alignItems: 'center', marginBottom: 32 },
  timerText: { color: '#B0B0B0', fontSize: 14 },
  resendText: { color: '#FF6B35', fontSize: 16, fontWeight: '600' },
  verifyButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  verifyButtonDisabled: {
    backgroundColor: 'rgba(255, 107, 53, 0.6)',
  },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  verifyButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  helpContainer: { alignItems: 'center' },
  helpText: { color: '#B0B0B0', fontSize: 14, textAlign: 'center' },
  footer: { padding: 16, alignItems: 'center' },
  footerText: { fontSize: 12, color: '#808080', textAlign: 'center' },
});

export default OTPScreen;
