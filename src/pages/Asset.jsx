import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {DropzoneArea} from 'material-ui-dropzone'
import {
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    IconButton,
    Table,
    TableBody,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core'
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {useMutation} from 'graphql-hooks'
import {UPLOAD_ASSET_FILE_MUTATION} from "../assets/queries";
import {useParams} from 'react-router-dom'
import LineNavigator from 'line-navigator'
import {Skeleton} from '@material-ui/lab';
import {StyledTableCell, StyledTableRow} from "../assets/styledElements";
import DeleteIcon from '@material-ui/icons/Delete';
import LabelIcon from '@material-ui/icons/Label';
import FeatureIcon from '@material-ui/icons/AccountTree';

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        left: 300,
        right: 0,
        position: "absolute",
        '& > *': {
            marginBottom: 20
        }
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.main,
        width: '100%',
        overflowX: 'auto'
    },
    fileUploadContainer: {
        maxHeight: 200
    },
    dropzone: {
        minHeight: 'auto',
        width: '50%',
        '& div': {
            display: 'flex',
        },
        '& svg': {
            display: 'none'
        }
    },
    input: {
        display: 'none'
    },
    dropzoneText: {
        marginLeft: 20,
        marginRight: 20
    },
    optionChecked: {
        color: '#58ff00'
    },
    optionUnchecked: {
        color: theme.palette.primary.dark
    },
    markedForDeletion: {
        backgroundColor: '#790f00',
    },
    markedForLabel: {
        backgroundColor: '#00791c'
    },
    markedForFeature: {
        backgroundColor: '#0082ae',
    },
    markedForDeletionIcon: {
        color: '#790f00',
    },
    markedForLabelIcon: {
        color: '#00791c'
    },
    markedForFeatureIcon: {
        color: '#0082ae',
    }
}));

function Asset() {

    const classes = useStyles();
    const {company_id, asset_id} = useParams();
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [uploadFile, {loading}] = useMutation(UPLOAD_ASSET_FILE_MUTATION);
    const [hasHeader, setHasHeader] = useState(false);
    const [headers, setHeaders] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState({
        remove: [],
        labels: [],
        features: []
    });

    const handleFile = (file) => {
        if (file !== null) {
            const n = new LineNavigator(file);
            n.readLines(0, 20, (err, index, lines, isEof, progress) => {
                let data = [];
                let headers = [];
                lines.forEach((line, index) => {
                    const split = line.trim().split(" ");

                    if (headers.length === 0 && !hasHeader) split.forEach((v, i) => {
                        headers.push("Column " + i)
                    });
                    data.push([split])
                });
                setHeaders(headers);
                setPreviewData(data);
                setFile(file);
            })
        }
    };

    const handleUpload = () => {
        uploadFile({
            variables: {
                assetId: asset_id,
                file: file
            }
        }).then((res) => {
            setFile(null)
        })
    };

    const handleCheck = (name, checked, column) => {
        let modifying = selectedColumns[name];
        for (let k in selectedColumns) {
            if (k !== name) {
                if (selectedColumns[k].includes(column))
                    return;
            }
        }
        if (checked) modifying.push(column);
        else modifying = modifying.filter(value => {
            return value !== column
        });

        setSelectedColumns({...selectedColumns, [name]: modifying})
    };

    const accept = ["application/vnd.ms-excel", ".csv", "text/plain", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    return (
        <div className={classes.content}>
            <div className={classes.container + ' ' + classes.fileUploadContainer}>
                <div>
                    <input
                        accept={accept}
                        type={"file"}
                        className={classes.input}
                        id={'upload-input'}
                    />
                    <label htmlFor={'upload-input'}>
                        <IconButton component={'span'}><FolderOpenIcon/></IconButton>
                    </label>
                </div>
                <DropzoneArea acceptedFiles={accept}
                              onDrop={handleFile} filesLimit={1} maxFileSize={50000000} showPreviewsInDropzone={false}
                              dropzoneClass={classes.dropzone}
                              dropzoneText={<Typography
                                  className={classes.dropzoneText}>{file ? file.name : "Drag .csv/.txt file here"}</Typography>}
                              onDelete={() => {
                                  setFile(null)
                              }} initialFiles={file ? file : []}
                />
                <Button variant={'contained'} color={'primary'} endIcon={<CloudUploadIcon/>} onClick={handleUpload}>Upload
                    & Start</Button>
            </div>
            <div className={classes.container}>
                {
                    file && !previewData ? <div className={classes.skeletons}>
                        <Skeleton variant={'text'} height={100} animation="wave"/>
                        <Skeleton variant={'rect'} height={300} animation="wave"/>
                    </div> : file && previewData ? <Table>
                        <TableHead>
                            <TableRow>
                                {
                                    headers.length > 0 ? headers.map((header) => {
                                        return <StyledTableCell>{header}</StyledTableCell>
                                    }) : previewData.length > 0 && previewData[0].length > 0 && previewData[0].forEach((v, i) => {
                                        return <StyledTableCell>{"Column (AUTO) " + i}</StyledTableCell>
                                    })
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                {
                                    previewData.length > 0 && previewData[0].length > 0 && previewData[0][0].map((v, i) => {
                                        return <StyledTableCell>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox
                                                    icon={<DeleteIcon className={classes.optionUnchecked}/>}
                                                    checkedIcon={<DeleteIcon
                                                        className={classes.markedForDeletionIcon}/>}
                                                    value={"remove"} onChange={event => {
                                                    handleCheck("remove", event.target.checked, i)
                                                }}
                                                    checked={selectedColumns.remove.includes(i)}/>} label={null}
                                                />
                                                <FormControlLabel control={<Checkbox
                                                    icon={<LabelIcon className={classes.optionUnchecked}/>}
                                                    checkedIcon={<LabelIcon className={classes.markedForLabelIcon}/>}
                                                    value={"labels"} onChange={event => {
                                                    handleCheck("labels", event.target.checked, i)
                                                }} checked={selectedColumns.labels.includes(i)}/>} label={null}
                                                />
                                                <FormControlLabel control={<Checkbox
                                                    icon={<FeatureIcon className={classes.optionUnchecked}/>}
                                                    checkedIcon={<FeatureIcon
                                                        className={classes.markedForFeatureIcon}/>}
                                                    value={"features"} onChange={event => {
                                                    handleCheck("features", event.target.checked, i)
                                                }} checked={selectedColumns.features.includes(i)}/>} label={null}
                                                />
                                            </FormGroup>
                                        </StyledTableCell>
                                    })
                                }
                            </StyledTableRow>
                            {
                                previewData.length > 0 && previewData.map((dp) => {
                                    return <StyledTableRow>
                                        {
                                            dp.length > 0 && dp[0].map((p, i) => {
                                                const styling = selectedColumns.remove.includes(i) ? classes.markedForDeletion : selectedColumns.labels.includes(i) ? classes.markedForLabel : selectedColumns.features.includes(i) ? classes.markedForFeature : null;

                                                return <StyledTableCell className={styling}>{p}</StyledTableCell>
                                            })
                                        }
                                    </StyledTableRow>
                                })
                            }
                        </TableBody>
                    </Table> : null
                }

            </div>
        </div>
    );
}

export default Asset;
