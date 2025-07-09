import { useSelector } from 'react-redux';
import { themeStyle } from '../contexts/ThemeSlice';

const useTheme = () => {
  const theme = (key) => useSelector(themeStyle(key));
  return { theme };
};

export default useTheme;