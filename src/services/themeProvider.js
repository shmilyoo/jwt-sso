import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    background: { default: '#eee' },
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff'
    },
    secondary: {
      light: '#82e9de',
      main: '#4db6ac',
      dark: '#00867d',
      contrastText: '#000'
    },
    info: {
      light: '#bef67a',
      main: '#8bc34a',
      dark: '#5a9216'
    },
    warn: {
      light: '#fff350',
      main: '#ffc107',
      dark: '#c79100'
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)'
    }
  },
  typography: {
    // Tell Material-UI what's the font-size on the html element is.
    htmlFontSize: 10,
    fontSize: 14,
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    title2: {
      fontSize: '2rem'
    },
    title3: {
      fontSize: '3rem',
      margin: '2rem 0'
    },
    title4: {
      fontSize: '4rem'
    }
  }
});

function themeProvider(Component) {
  return class extends React.Component {
    static displayName = 'material-ui-withRoot';
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    render() {
      return (
        <MuiThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...this.props} />
        </MuiThemeProvider>
      );
    }
  };
}
themeProvider.displayName =
  "Hoc to add material-ui's MthemeProvider and CssBaseline";

export default themeProvider;
