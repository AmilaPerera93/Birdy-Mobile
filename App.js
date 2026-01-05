// App.js
import AppNavigator from './src/navigation/AppNavigator';

// This line triggers the connection to Firebase immediately
import './src/config/firebase';

export default function App() {
  return (
    <AppNavigator />
  );
}