import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {DropzoneArea} from 'material-ui-dropzone'
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    IconButton,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@material-ui/core'
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {useManualQuery, useMutation} from 'graphql-hooks'
import {ASSET_QUERY, UPLOAD_ASSET_FILE_MUTATION} from "../assets/queries";
import {useParams} from 'react-router-dom'
import LineNavigator from 'line-navigator'
import {Skeleton} from '@material-ui/lab';
import {StyledTableCell, StyledTableRow} from "../assets/styledElements";
import DeleteIcon from '@material-ui/icons/Delete';
import LabelIcon from '@material-ui/icons/Label';
import FeatureIcon from '@material-ui/icons/AccountTree';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';

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
        width: '100%'
    },
    containerOverflow: {
        overflowX: 'auto'
    },
    containerCentered: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    dataTitle: {
        padding: 10,
        marginLeft: 'auto'
    },
    fileUploadContainer: {
        maxHeight: 200,
        display: 'flex',
        padding: 10,
        boxSizing: 'border-box'
    },
    uploadButton: {
        marginLeft: 'auto'
    },
    dropzone: {
        minHeight: 'auto',
        width: '50%',
        '& div': {
            display: 'flex',
        },
        height: '80%',
        backgroundColor: theme.palette.secondary.main
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
    },
    dialogTitle: {
        backgroundColor: theme.palette.tertiary.dark
    },
    dialogContent: {
        backgroundColor: theme.palette.tertiary.dark
    },
    dialogActions: {
        backgroundColor: theme.palette.tertiary.dark
    },
    skeletons: {
        width: '95%',
        padding: theme.spacing(2)
    },
    numberOfFiles: {
        marginLeft: 'auto'
    }
}));

function Asset() {

    const classes = useStyles();
    const {company_id, asset_id} = useParams();
    const [files, setFiles] = useState([]);
    const [previewData, setPreviewData] = useState(null);
    const [uploadFile, {loading}] = useMutation(UPLOAD_ASSET_FILE_MUTATION);
    const [getAsset, {loading2, error}] = useManualQuery(ASSET_QUERY, {
        variables: {
            assetId: parseInt(asset_id)
        }
    });
    const [numberOfFiles, setNumberOfFiles] = useState(0);
    const [headers, setHeaders] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState({
        remove: [],
        labels: [],
        features: []
    });
    const [modifyingHeader, setModifyingHeader] = useState(null);
    const [oldHeader, setOldHeader] = useState([]);
    const [openSeparatorDialog, setOpenSeparatorDialog] = useState(false);
    const [separator, setSeparator] = useState(null);

    useEffect(() => {
        if (files.length === 0) {
            setSelectedColumns({
                remove: [],
                labels: [],
                features: []
            });
            setPreviewData(null);
            setHeaders([])
        }
    }, [files]);

    useEffect(() => {
        getAsset().then((res) => {
            setNumberOfFiles(res.data.asset.files.numberOfFiles);
        })
    }, []);

    const handleFile = (separator) => {
        let file = null;
        if (files.length > 0)
            file = files[0];
        if (file !== null && previewData === null) {
            const n = new LineNavigator(file);
            n.readLines(0, 20, (err, index, lines, isEof, progress) => {
                let data = [];
                let headers = [];
                let defaultLabels = [];
                let defaultFeatures = [];
                lines.forEach((line, index) => {
                    const split = line.trim().split(separator);

                    if (headers.length === 0) split.forEach((v, i) => {
                        headers.push("Column " + i)
                    });
                    if (defaultLabels.length === 0) defaultLabels.push(0);
                    if (defaultFeatures.length === 0) split.forEach((v, i) => {
                        if (i !== 0) defaultFeatures.push(i)
                    });
                    data.push([split])
                });
                setSelectedColumns({...selectedColumns, labels: defaultLabels, features: defaultFeatures});
                setHeaders(headers);
                setPreviewData(data);
            })
        }
    };

    const handleUpload = () => {
        uploadFile({
            variables: {
                assetId: asset_id,
                files: files,
                headers: headers,
                ...selectedColumns,
                separator: separator
            }
        }).then((res) => {
            setNumberOfFiles(numberOfFiles + files.length);
            setFiles([]);
        })
    };

    const handleCheck = (name, checked, column) => {

        for (let k in selectedColumns) {
            if (k !== name) {
                if (selectedColumns[k].includes(column))
                    return;
            }
        }
        let modifying = selectedColumns[name];
        if (checked) modifying.push(column);
        else modifying = modifying.filter(value => {
            return value !== column
        });
        modifying.sort((a, b) => {
            return a - b
        });
        setSelectedColumns({...selectedColumns, [name]: modifying})
    };

    const handleHeaderClick = (column) => (event) => {
        setModifyingHeader(column)
    };

    const handleEnter = (column) => (event) => {
        if (event.key === 'Enter') {
            let value = event.target.value;
            if (value) value = value.trim();
            else return;
            if (value.length === 0) return;
            const arr = headers;
            arr[column] = value;
            setHeaders(arr);
            setModifyingHeader(null)
        }
    };

    const handleSetHeader = (event) => {
        if (event.target.checked) {
            setOldHeader(headers);
            setHeaders(previewData[0][0]);
            let newData = previewData;
            newData.shift();
            setPreviewData(newData)
        } else {
            let newData = previewData;
            newData.unshift([headers]);
            setHeaders(oldHeader);
            setPreviewData(newData);
            setOldHeader([]);
        }
    };

    const handleDialogClose = (separator) => {
        if (separator !== undefined) {
            setSeparator(separator);
            handleFile(separator)
        } else {
            setFiles([])
        }
        setOpenSeparatorDialog(false)
    };

    const handleDialogOpen = (newFile) => {
        setFiles([...files, newFile]);
        if (files.length === 0) {
            setOpenSeparatorDialog(true);
        }
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
                        <Tooltip title={"Open file"}>
                            <IconButton component={'span'}><FolderOpenIcon/></IconButton>
                        </Tooltip>
                    </label>
                </div>
                <DropzoneArea acceptedFiles={accept}
                              files={files}
                              onDrop={handleDialogOpen} maxFileSize={5000000000}
                              showPreviewsInDropzone={true}
                              useChipsForPreview={true}
                              filesLimit={100}
                              dropzoneClass={classes.dropzone}
                              dropzoneText={<Typography
                                  className={classes.dropzoneText}>{files.length > 0 ? files.map((f) => f.name + ", ") : "Drag .csv/.txt files here"}</Typography>}
                              onDelete={(file) => {
                                  const newFiles = files.filter((f) => f !== file);
                                  setFiles(newFiles)
                              }} initialFiles={files}
                />
                <div className={classes.numberOfFiles}>
                    <Typography>Number of files uploaded: {numberOfFiles}</Typography>
                </div>
                <Button variant={'contained'} color={'primary'} endIcon={<CloudUploadIcon/>} onClick={handleUpload}
                        className={classes.uploadButton}>Upload
                    & Start</Button>
            </div>
            <div className={classes.container} style={{flexDirection: 'column'}}>
                {
                    previewData && files.length > 0 ?
                        <div className={classes.container + ' ' + classes.containerCentered}>
                            <Typography variant={'h4'} className={classes.dataTitle} color={"textSecondary"}>Preview of
                                data
                                from {files[0].name}</Typography>
                            <FormControlLabel control={<Checkbox onChange={handleSetHeader} color={"primary"}/>}
                                              label={"Has header?"} style={{marginLeft: 'auto'}}/>
                        </div> : null
                }
                <div className={classes.container + ' ' + classes.containerOverflow}>
                    {
                        files.length > 0 && !previewData ? <div className={classes.skeletons}>
                            <Skeleton variant={'text'} height={100} animation="wave"/>
                            <Skeleton variant={'rect'} height={300} animation="wave"/>
                        </div> : files.length > 0 && previewData ? <Table>
                            <TableHead>
                                <TableRow>
                                    {
                                        headers.length > 0 && headers.map((header, column) => {
                                            return <StyledTableCell>
                                                {
                                                    modifyingHeader === column ?
                                                        <TextField autoFocus={true} defaultValue={header}
                                                                   style={{minWidth: 100}}
                                                                   onKeyDown={handleEnter(column)}/> :
                                                        <Typography onClick={handleHeaderClick(column)}>{header}
                                                            <EditIcon style={{fontSize: 15}}/></Typography>
                                                }
                                            </StyledTableCell>
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
                                                    <Tooltip title={"Mark for removal"}>
                                                        <FormControlLabel control={<Checkbox
                                                            icon={<DeleteIcon className={classes.optionUnchecked}/>}
                                                            checkedIcon={<DeleteIcon
                                                                className={classes.markedForDeletionIcon}/>}
                                                            value={"remove"} onChange={event => {
                                                            handleCheck("remove", event.target.checked, i)
                                                        }}
                                                            checked={selectedColumns.remove.includes(i)}/>} label={null}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title={"Mark as label"}>
                                                        <FormControlLabel control={<Checkbox
                                                            icon={<LabelIcon className={classes.optionUnchecked}/>}
                                                            checkedIcon={<LabelIcon
                                                                className={classes.markedForLabelIcon}/>}
                                                            value={"labels"} onChange={event => {
                                                            handleCheck("labels", event.target.checked, i)
                                                        }} checked={selectedColumns.labels.includes(i)}/>} label={null}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title={"Mark as feature"}>
                                                        <FormControlLabel control={<Checkbox
                                                            icon={<FeatureIcon className={classes.optionUnchecked}/>}
                                                            checkedIcon={<FeatureIcon
                                                                className={classes.markedForFeatureIcon}/>}
                                                            value={"features"} onChange={event => {
                                                            handleCheck("features", event.target.checked, i)
                                                        }} checked={selectedColumns.features.includes(i)}/>}
                                                                          label={null}
                                                        />
                                                    </Tooltip>
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
            <Dialog open={openSeparatorDialog} onClose={handleDialogClose}>
                <DialogTitle onClose={handleDialogClose} className={classes.dialogTitle}>
                    <Typography>Separator</Typography>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <Typography>Choose your separator</Typography>
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button onClick={() => handleDialogClose(" ")} color={"secondary"}>
                        Space
                    </Button>
                    <Button onClick={() => handleDialogClose(",")} color={"secondary"}>
                        Comma
                    </Button>
                    <Button onClick={() => handleDialogClose(";")} color={"secondary"}>
                        Semi-colon
                    </Button>
                    <Button onClick={() => handleDialogClose()} color={"primary"}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Asset;
