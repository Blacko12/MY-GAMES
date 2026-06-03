import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/authStore';

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userPhone}>{user?.phoneNumber}</Text>
          <Text style={styles.userStatus}>{user?.status || 'Available'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Edit Profile</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Privacy & Security</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Help & Support</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#075E54',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  userStatus: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  settingItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#000',
  },
  settingValue: {
    fontSize: 20,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;