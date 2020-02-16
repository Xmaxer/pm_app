import { createMuiTheme } from '@material-ui/core/styles';
import palette from './colours';

const generatedPalette = createMuiTheme({
    palette: {
        primary: {
            main: palette.primary
        },
        secondary: {
            main: palette.secondary
        },
        error: {
            main: palette.error
        },
        contrastThreshold: 3,
        tonalOffset: 0.2
    }
});

const theme = createMuiTheme({
    ...generatedPalette,
    spacing: 5
});

export default theme;
