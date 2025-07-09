import { useSelector } from 'react-redux';
import { translate } from '../contexts/LanguageSlice'; // adjust path if needed

const useTranslate = () => {
  const t = (key) => useSelector(translate(key));
  return { t };
};

export default useTranslate;