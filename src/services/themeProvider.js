import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

/*
google four color
web:
green:{
  main:'#00b74e',
  light:'#59ea7d',
  dark:'#008620',
  contrastText:'#000'
},
yellow:{
  main:'#F5C900',
  light:'#fffc50',
  dark:'#be9900',
  contrastText:'#000'
},
red:{
  main:'#EC2935',
  light:'#ff6560',
  dark:'#b1000e',
  contrastText:'#000'
},
blue:{
  main:'#6657F8',
  light:'#9f85ff',
  dark:'#1d2cc4',
  contrastText:'#FFF'
}
*/

const primaryTextColor = 'rgba(0, 0, 0, 0.87)';
const secondaryTextColor = 'rgba(0, 0, 0, 0.54)';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    background: { default: '#eee' },
    // primary: {
    //   light: '#757ce8',
    //   main: '#3f50b5',
    //   dark: '#002884',
    //   contrastText: '#fff'
    // },
    secondary: {
      light: '#82e9de',
      main: '#4db6ac',
      dark: '#00867d',
      contrastText: '#000'
    },
    primary: {
      main: '#6657F8',
      light: '#9f85ff',
      dark: '#1d2cc4',
      contrastText: '#FFF'
    },
    // secondary: {
    //   main: '#6657F8',
    //   light: '#9f85ff',
    //   dark: '#1d2cc4',
    //   contrastText: '#FFF'
    // },
    info: {
      light: '#9fc8ff',
      main: '#6a98e9',
      dark: '#316ab6',
      contrastText: '#000'
    },
    warn: {
      main: '#F5C900',
      light: '#fffc50',
      dark: '#be9900',
      contrastText: '#000'
    },
    error: {
      main: '#EC2935',
      light: '#ff6560',
      dark: '#b1000e',
      contrastText: '#000'
    },
    text: {
      primary: primaryTextColor,
      secondary: secondaryTextColor
    }
  },
  typography: {
    useNextVariants: true,
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
  },
  sharedClass: {
    link: {
      cursor: 'pointer',
      '&:hover': { textDecoration: 'underline' },
      '&:visited': { color: secondaryTextColor }
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
