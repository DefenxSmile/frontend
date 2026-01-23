import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider, type Theme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
  theme: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

const createAppTheme = (mode: ThemeMode): Theme => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#667eea',
        light: '#8B9AFF',
        dark: '#5568d3',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#4CAF50',
        light: '#81C784',
        dark: '#388E3C',
      },
      background: {
        default: mode === 'light' ? '#F5F5F5' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
      text: {
        primary: mode === 'light' ? '#212121' : '#FFFFFF',
        secondary: mode === 'light' ? '#757575' : '#B0B0B0',
      },
      grey: {
        50: mode === 'light' ? '#FAFAFA' : '#1E1E1E',
        100: mode === 'light' ? '#F5F5F5' : '#2C2C2C',
        200: mode === 'light' ? '#EEEEEE' : '#3A3A3A',
        300: mode === 'light' ? '#E0E0E0' : '#484848',
        400: mode === 'light' ? '#BDBDBD' : '#565656',
        500: mode === 'light' ? '#9E9E9E' : '#757575',
        600: mode === 'light' ? '#757575' : '#9E9E9E',
        700: mode === 'light' ? '#616161' : '#BDBDBD',
        800: mode === 'light' ? '#424242' : '#E0E0E0',
        900: mode === 'light' ? '#212121' : '#EEEEEE',
      },
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      h4: {
        fontWeight: 600,
        fontSize: '24px',
      },
      h6: {
        fontWeight: 600,
        fontSize: '18px',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            padding: '10px 24px',
            fontSize: '16px',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
          containedPrimary: {
            backgroundColor: '#667eea',
            '&:hover': {
              backgroundColor: '#5568d3',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            boxShadow: mode === 'light' 
              ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
              : '0 2px 8px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
  })
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode
    return savedMode || 'light'
  })

  useEffect(() => {
    localStorage.setItem('themeMode', mode)
  }, [mode])

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const theme = createAppTheme(mode)

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

