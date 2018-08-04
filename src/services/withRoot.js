// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import CssBaseline from '@material-ui/core/CssBaseline';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: purple[300],
      main: purple[500],
      dark: purple[700]
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700]
    }
  }
});

function withRoot(Component: ComponentType<*>) {
  return class extends React.Component<{}> {
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
withRoot.displayName =
  "Hoc to add material-ui's MthemeProvider and CssBaseline";

export default withRoot;
