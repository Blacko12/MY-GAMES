import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#075E54',
  secondary: '#128C7E',
  accent: '#25D366',
  white: '#fff',
  black: '#000',
  gray: '#999',
  lightGray: '#f5f5f5',
  border: '#f0f0f0',
  error: '#ff6b6b',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});