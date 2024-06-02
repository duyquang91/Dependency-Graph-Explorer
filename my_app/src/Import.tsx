import React, { useContext, useRef, useState } from 'react'
import { Alert, Button, Card, CardContent, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { dependencyManagerProviders } from './DependencyManagerProviders/DependencyManagerProviders'
import { IsMobileContext } from './Base'
import { useNavigate } from 'react-router-dom'

function Import() {
    const providers = dependencyManagerProviders
    const navigate = useNavigate()
    const [canStart, setCanStart] = useState(false)
    const [provider, setProvider] = useState(providers[0])
    const isMobile: Boolean = useContext(IsMobileContext)

    return (
        isMobile ? (
            <div> <Content /> </div>
        ) : (
            <div className='Browser'> <Content /> </div>
        )
    )

    function Content() {
        return (
            <div className='Import'>
                <Card>
                    <CardContent>
                        <Stack spacing={2}>
                            <Alert variant='outlined' severity='info'>
                                Choose a Dependency manager then paste its resolved dependency graph file to start exploring
                            </Alert>
                            <TextField variant='outlined' defaultValue={provider.name} select label='Dependency manager'>
                                {providers.map((item, index) => <MenuItem key={item.name} value={item.name} onClick={e => setProvider(providers[index])}>{item.name}</MenuItem>)}
                            </TextField>
                            <TextField variant='outlined' multiline fullWidth label={provider.resolvedFileName} rows={8} onChange={e => { setCanStart(e.target.value != '') }} />
                            <Button variant='contained' disabled={!canStart}>Start</Button>
                            <Divider>or</Divider>
                            <Button variant='outlined' onClick={e => {navigate('/graphViewer')}}>Try a demo</Button>
                        </Stack>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default Import