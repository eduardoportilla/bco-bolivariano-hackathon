// Mock for @react-navigation/native-stack
const createNativeStackNavigator = () => ({
  Navigator: ({ children }) => children,
  Screen: () => null,
  Group: ({ children }) => children,
});

module.exports = {
  createNativeStackNavigator,
};
