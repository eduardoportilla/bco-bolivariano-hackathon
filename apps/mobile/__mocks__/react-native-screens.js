// Mock for react-native-screens
const enableScreens = jest.fn();
const enableFreeze = jest.fn();

const Screen = ({ children }) => children;
const ScreenContainer = ({ children }) => children;
const ScreenStack = ({ children }) => children;
const ScreenStackHeaderConfig = () => null;
const ScreenStackHeaderSubview = ({ children }) => children;
const ScreenStackHeaderBackButtonImage = () => null;
const ScreenStackHeaderRightView = ({ children }) => children;
const ScreenStackHeaderLeftView = ({ children }) => children;
const ScreenStackHeaderCenterView = ({ children }) => children;
const SearchBarCommands = {};
const NativeScreen = ({ children }) => children;
const NativeScreenContainer = ({ children }) => children;
const NativeScreenNavigationContainer = ({ children }) => children;

const useTransitionProgress = () => ({
  progress: { value: 1 },
});

module.exports = {
  enableScreens,
  enableFreeze,
  Screen,
  ScreenContainer,
  ScreenStack,
  ScreenStackHeaderConfig,
  ScreenStackHeaderSubview,
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderRightView,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderCenterView,
  SearchBarCommands,
  NativeScreen,
  NativeScreenContainer,
  NativeScreenNavigationContainer,
  useTransitionProgress,
};
