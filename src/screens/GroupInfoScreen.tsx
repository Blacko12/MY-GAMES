import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

interface GroupInfo {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  memberCount: number;
  createdAt: number;
  members: any[];
}

const GroupInfoScreen = ({ route, navigation }: any) => {
  const { groupId } = route.params;
  const { user } = useAuthStore();
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadGroupInfo();
  }, []);

  const loadGroupInfo = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/groups/${groupId}`);
      setGroupInfo(response.data.group);
      setGroupName(response.data.group.name);
      setDescription(response.data.group.description || '');
    } catch (error) {
      console.error('Error loading group info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGroup = async () => {
    try {
      await api.put(`/groups/${groupId}`, {
        name: groupName,
        description: description,
      });
      setIsEditing(false);
      loadGroupInfo();
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await api.delete(`/groups/${groupId}/members/${memberId}`);
      loadGroupInfo();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  if (loading || !groupInfo) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#075E54" />
      </View>
    );
  }

  const isAdmin = groupInfo.members.some(
    (m) => m.userId === user?.id && m.role === 'admin'
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Group Info</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Group Header */}
      <View style={styles.groupHeader}>
        <Image
          source={{ uri: groupInfo.avatar || 'https://via.placeholder.com/100' }}
          style={styles.groupImage}
        />
        <Text style={styles.groupName}>{groupInfo.name}</Text>
        <Text style={styles.memberCount}>{groupInfo.memberCount} members</Text>
      </View>

      {/* Edit Group (if Admin) */}
      {isAdmin && (
        <View style={styles.section}>
          {isEditing ? (
            <View style={styles.editForm}>
              <Text style={styles.editTitle}>Edit Group</Text>
              <TextInput
                style={styles.input}
                placeholder="Group Name"
                placeholderTextColor="#999"
                value={groupName}
                onChangeText={setGroupName}
              />
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Description"
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
              />
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleUpdateGroup}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>✏️ Edit Group</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Group Description */}
      {groupInfo.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{groupInfo.description}</Text>
        </View>
      )}

      {/* Members */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Members ({groupInfo.memberCount})</Text>
        {groupInfo.members.map((member) => (
          <View key={member.userId} style={styles.memberItem}>
            <Image
              source={{
                uri: member.avatar || 'https://via.placeholder.com/40',
              }}
              style={styles.memberAvatar}
            />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>
                {member.role === 'admin' ? '👑 Admin' : 'Member'}
              </Text>
            </View>
            {isAdmin && member.userId !== user?.id && (
              <TouchableOpacity
                onPress={() => handleRemoveMember(member.userId)}
              >
                <Text style={styles.removeButton}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Leave Group */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.leaveButton}>
          <Text style={styles.leaveButtonText}>👋 Leave Group</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#075E54',
  },
  backButton: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  groupHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  memberCount: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 12,
    marginHorizontal: 12,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#075E54',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editForm: {
    gap: 12,
  },
  editTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#075E54',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  memberRole: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  removeButton: {
    fontSize: 18,
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  leaveButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  leaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GroupInfoScreen;