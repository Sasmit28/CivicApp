import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const HelpSupportScreen = ({ navigation }) => {
  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const emergencyContacts = [
    { title: 'Police Emergency', number: '100', icon: 'shield-outline' },
    { title: 'Fire Department', number: '101', icon: 'flame-outline' },
    { title: 'Ambulance', number: '108', icon: 'medical-outline' },
    { title: 'Women Helpline', number: '1091', icon: 'person-outline' },
    { title: 'Child Helpline', number: '1098', icon: 'heart-outline' },
  ];

  const supportOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email',
      icon: 'mail-outline',
      action: () => handleEmail('support@civicapp.com')
    },
    {
      title: 'FAQ',
      description: 'Frequently asked questions',
      icon: 'help-circle-outline',
      action: () => {} // Could navigate to FAQ screen
    },
    {
      title: 'Report a Bug',
      description: 'Report technical issues',
      icon: 'bug-outline',
      action: () => handleEmail('bugs@civicapp.com')
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
          <Text style={styles.title}>Help & Support</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Emergency Contacts */}
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <BlurView intensity={20} tint="dark" style={styles.card}>
            {emergencyContacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.contactItem,
                  index < emergencyContacts.length - 1 && styles.itemBorder
                ]}
                onPress={() => handleCall(contact.number)}
              >
                <View style={styles.contactLeft}>
                  <View style={styles.contactIcon}>
                    <Ionicons name={contact.icon} size={24} color="#FF6B35" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactTitle}>{contact.title}</Text>
                    <Text style={styles.contactNumber}>{contact.number}</Text>
                  </View>
                </View>
                <Ionicons name="call-outline" size={20} color="#FF6B35" />
              </TouchableOpacity>
            ))}
          </BlurView>

          {/* Support Options */}
          <Text style={styles.sectionTitle}>Get Support</Text>
          <BlurView intensity={20} tint="dark" style={styles.card}>
            {supportOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  index < supportOptions.length - 1 && styles.itemBorder
                ]}
                onPress={option.action}
              >
                <View style={styles.optionLeft}>
                  <Ionicons name={option.icon} size={24} color="#FF6B35" />
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
              </TouchableOpacity>
            ))}
          </BlurView>

          {/* Additional Info */}
          <BlurView intensity={20} tint="dark" style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={32} color="#FF6B35" />
            <Text style={styles.infoTitle}>Need Immediate Help?</Text>
            <Text style={styles.infoDescription}>
              For urgent civic issues or emergencies, please call the appropriate emergency number above. 
              For app-related support, use the email options or contact us through the provided channels.
            </Text>
          </BlurView>

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 24,
    overflow: 'hidden',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionInfo: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default HelpSupportScreen;