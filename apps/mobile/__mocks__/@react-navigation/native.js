// Mock for @react-navigation/native
const React = require('react');

const NavigationContainer = ({ children }) => children;

const useNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(),
  canGoBack: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
});

const useRoute = () => ({
  key: 'test-route-key',
  name: 'TestRoute',
  params: {},
});

const useFocusEffect = (callback) => {
  React.useEffect(() => {
    callback();
  }, [callback]);
};

const useIsFocused = () => true;

module.exports = {
  NavigationContainer,
  useNavigation,
  useRoute,
  useFocusEffect,
  useIsFocused,
  createNavigatorFactory: jest.fn(),
  CommonActions: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  },
  StackActions: {
    push: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
  },
};
