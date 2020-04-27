import {createMuiTheme} from '@material-ui/core/styles';
import palette from './colours';

const generatedPalette = createMuiTheme({
    palette: {
        primary: {
            main: palette.primary
        },
        secondary: {
            main: palette.secondary
        },
        tertiary: {
            main: palette.tertiary
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
    spacing: 5,
    props: {
        MuiGrid: {
            container: {
                backgroundColor: generatedPalette.palette.secondary.main
            }
        }
    },
    overrides: {
        MuiTextField: {
            root: {
                color: generatedPalette.palette.tertiary.main,
                '& .MuiInput-underline:after': {
                    borderBottomColor: generatedPalette.palette.tertiary.main
                },
                '& .MuiInput-underline:before': {
                    borderBottomColor: 'lightgray'
                },
                '& .MuiInput-root': {
                    color: generatedPalette.palette.tertiary.main,
                },
                '& label.Mui-focused': {
                    color: generatedPalette.palette.tertiary.main,
                },
            }
        }
    }
});

export default theme;
