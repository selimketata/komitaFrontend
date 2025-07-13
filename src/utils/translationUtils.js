import { useTranslation } from 'react-i18next';

export const useProDashboardTranslation = () => {
  const { t } = useTranslation();
  
  return {
    t: (key) => t(`professionalDashboard.${key}`),
    tCommon: (key) => t(`common.${key}`)
  };
};