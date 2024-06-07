import React, { ChangeEvent, ChangeEventHandler, useContext, useState } from 'react'
import { Alert, Button, Card, CardContent, Divider, Grid, IconButton, MenuItem, Stack, TextField, styled } from '@mui/material'
import { dependencyManagerProviders } from './DependencyManagerProviders/DependencyManagerProviders'
import { IsMobileContext } from './Base'
import { useNavigate } from 'react-router-dom'
import { Clear, CloudUpload } from '@mui/icons-material'

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function Import() {
    const navigate = useNavigate()
    const [text, setText] = useState('')
    const [prefix, setPrefix] = useState('')
    const [error, setError] = useState(false)
    var selectedIndex = 0
    const [provider, setProvider] = useState(dependencyManagerProviders[0])
    const isMobile: Boolean = useContext(IsMobileContext)
    const selectIndex = (e: React.MouseEvent, i: number) => {
        selectedIndex = i
        setProvider(dependencyManagerProviders[i])
        setText('')
        setPrefix('')
    }
    const startParsing = (e: React.MouseEvent) => {
        provider.setGraphFromFile(text, prefix.trim())
        if (provider.graph) {
            setError(false)
            navigate(`/graphViewer/${selectedIndex}`)
        } else {
            setError(true)
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];

        if (file) {
            const reader = new FileReader();
            reader.readAsText(file)
            reader.onload = (e) => setText(e.target!.result as string)
        }
    }

    return (
        <div className={isMobile ? 'Import' : 'Browser'}>
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Alert variant='outlined' severity='info'>Choose a Dependency manager then paste its resolved dependency graph file to start exploring</Alert>
                        <TextField variant='outlined' defaultValue={provider.name} select label='Dependency manager:'>
                            {dependencyManagerProviders.map((item, index) => <MenuItem key={item.name} value={item.name} onClick={(e) => { selectIndex(e, index) }}>{item.name} </MenuItem>)}
                        </TextField>
                        <TextField error={error} variant='outlined' multiline fullWidth label={error ? 'Invalid file format!' : provider.resolvedFileName} rows={8} value={text} onChange={(e) => { setText(e.target.value); setError(false) }} />
                        <Grid container direction='row' columnSpacing={1}>
                            <Grid item xs>
                                <TextField fullWidth value={prefix} onChange={e => setPrefix(e.target.value)} label="Module's prefix name:" helperText="Optional: Only focus to your modules by filtering out external modules" size="small" InputProps={{
                                    endAdornment: prefix !== '' ? (<IconButton size='small' onClick={() => setPrefix('')}><Clear /></IconButton>) : null
                                }}>
                                </TextField>
                            </Grid>
                            <Grid item><Button tabIndex={-1} role={undefined} size='medium' component="label" variant='contained' startIcon={<CloudUpload />}>Upload file <VisuallyHiddenInput type='file' onChange={handleChange}></VisuallyHiddenInput></Button></Grid>
                        </Grid>
                        <Stack direction='row' spacing={1}>
                            <Button fullWidth variant='contained' disabled={text === ''} onClick={(e) => { startParsing(e) }}>Start</Button>
                            <Button fullWidth variant='outlined' onClick={(e) => navigate('/graphViewer/-1')}>Try a demo</Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </div>
    )
}

export default Import