// src/navigation/AppNavigator.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

// Temporary Test Screen
function TestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Birdy App v1.0</Text>
      <Text style={styles.subText}>Phase 1 Complete: System Online.</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
            name="Home" 
            component={TestScreen} 
            options={{ title: 'Welcome to Birdy' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#FF5733' }, // Birdy Orange color
  subText: { marginTop: 10, color: 'gray' }
});