import { useLanguage } from '@/contexts/LanguageContext';

export function useRTL() {
  const { currentLanguage } = useLanguage();
  return currentLanguage?.direction === 'rtl';
}

export function getTextAlign(isRTL: boolean) {
  return isRTL ? 'right' : 'left';
}

export function getDirection(isRTL: boolean) {
  return isRTL ? 'rtl' : 'ltr';
}

export function getFlexDirection(isRTL: boolean, defaultDirection: 'row' | 'row-reverse' = 'row') {
  if (defaultDirection === 'row') {
    return isRTL ? 'row-reverse' : 'row';
  }
  return isRTL ? 'row' : 'row-reverse';
}

export function getMargin(isRTL: boolean, marginStart: number, marginEnd: number = 0) {
  return {
    marginLeft: isRTL ? marginEnd : marginStart,
    marginRight: isRTL ? marginStart : marginEnd,
  };
}

export function getPadding(isRTL: boolean, paddingStart: number, paddingEnd: number = 0) {
  return {
    paddingLeft: isRTL ? paddingEnd : paddingStart,
    paddingRight: isRTL ? paddingStart : paddingEnd,
  };
}

export function getBorderRadius(isRTL: boolean, radius: string | number) {
  return {
    borderTopLeftRadius: isRTL ? 0 : radius,
    borderTopRightRadius: isRTL ? radius : 0,
    borderBottomLeftRadius: isRTL ? 0 : radius,
    borderBottomRightRadius: isRTL ? radius : 0,
  };
}

export function getTransform(isRTL: boolean, transform: string) {
  if (transform.includes('translate')) {
    return transform.replace(/translate(X|3d)?\(([-\d.]+)/, (match, type, value) => {
      const newValue = parseFloat(value) * -1;
      return `translate${type || ''}(${newValue}`;
    });
  }
  return transform;
}
