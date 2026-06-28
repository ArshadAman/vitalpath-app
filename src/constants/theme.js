export const COLORS = {
  background: '#fbf9f8',
  surface: '#ffffff',
  border: '#E5E5E5',
  
  primary: '#2b6c00',         // Health Green
  primaryShadow: '#58A700',
  primaryContainer: '#eff7e6',
  
  secondary: '#006590',       // Medical Blue
  secondaryShadow: '#004c6e',
  
  text: '#1b1c1c',            // Ink Primary
  textMuted: '#777777',       // Ink Secondary
  
  // Highlight Accents
  orange: '#FF9600',          // Streak Activity
  yellow: '#FFC800',          // XP Insights
  red: '#FF4B4B',             // Alert Critical
  purple: '#CE82FF',          // Sleep Premium
  
  glassBorder: 'rgba(229, 229, 229, 0.4)',
};

export const SHADOWS = {
  // Tactile 3D shadow offset buttons
  btn3D: {
    shadowColor: COLORS.primaryShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  card3D: {
    shadowColor: COLORS.border,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  btn3DActive: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  }
};
