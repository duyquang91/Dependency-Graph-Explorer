import React, { useContext, useState } from 'react'
import { Alert, Button, Card, CardContent, Divider, MenuItem, Stack, TextField } from '@mui/material'
import { dependencyManagerProviders } from './DependencyManagerProviders/DependencyManagerProviders'
import { IsMobileContext } from './Base'
import { useNavigate } from 'react-router-dom'

function Import() {
    const navigate = useNavigate()
    const [text, setText] = useState('')
    const [error, setError] = useState(false)
    var selectedIndex = 0
    const [provider, setProvider] = useState(dependencyManagerProviders[0])
    const isMobile: Boolean = useContext(IsMobileContext)
    const selectIndex = (e: React.MouseEvent, i: number) => {
        selectedIndex = i
        setProvider(dependencyManagerProviders[i])
    }
    const startParsing = (e: React.MouseEvent) => {
        provider.updateResolvedFile(text)
        if (provider.isValid) {
            setError(false)
            navigate(`/graphViewer/${selectedIndex}`)
        } else {
            setError(true)
        }
    }

    return (
        isMobile ? (
            <div className='Import'>
                <Card>
                    <CardContent>
                        <Stack spacing={2}>
                            <Alert variant='outlined' severity='info'>Choose a Dependency manager then paste its resolved dependency graph file to start exploring</Alert>
                            <TextField variant='outlined' defaultValue={provider.name} select label='Dependency manager:'>
                                {dependencyManagerProviders.map((item, index) => <MenuItem key={item.name} value={item.name} onClick={(e) => { selectIndex(e, index) }}>{item.name} </MenuItem>)}
                            </TextField>
                            <TextField error={error} variant='outlined' multiline fullWidth label={error ? 'Invalid file format!' : provider.resolvedFileName} rows={8} value={text} onChange={(e) => { setText(e.target.value); setError(false) }} />
                            <Button variant='contained' disabled={text === ''} onClick={(e) => { startParsing(e) }}>Start</Button>
                            <Divider>or</Divider>
                            <Button variant='outlined' onClick={(e) => navigate('/graphViewer/-1')}>Try a demo</Button>
                        </Stack>
                    </CardContent>
                </Card>
            </div>) : (
            <div className='Browser'>
                <Card>
                    <CardContent>
                        <Stack spacing={2}>
                            <Alert variant='outlined' severity='info'>Choose a Dependency manager then paste its resolved dependency graph file to start exploring</Alert>
                            <TextField variant='outlined' defaultValue={provider.name} select label='Dependency manager:'>
                                {dependencyManagerProviders.map((item, index) => <MenuItem key={item.name} value={item.name} onClick={(e) => { selectIndex(e, index) }}>{item.name} </MenuItem>)}
                            </TextField>
                            <TextField error={error} variant='outlined' multiline fullWidth label={error ? 'Invalid file format!' : provider.resolvedFileName} rows={8} value={text} onChange={(e) => { setText(e.target.value); setError(false) }} />
                            <Button variant='contained' disabled={text === ''} onClick={(e) => { startParsing(e) }}>Start</Button>
                            <Divider>or</Divider>
                            <Button variant='outlined' onClick={(e) => navigate('/graphViewer/-1')}>Try a demo</Button>
                        </Stack>
                    </CardContent>
                </Card>
            </div>)
    )
}

export default Import