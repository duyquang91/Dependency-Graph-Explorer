import React, { useState } from 'react'
import { Alert, Button, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material'

type DependencyProvider = { name: string, file: string }

const fileTypes: DependencyProvider[] = (
    [
        {
            name: 'Swift package manager',
            file: 'Package.resolved'
        },
        {
            name: 'Carthage',
            file: 'Cartfile.resolved'
        },
        {
            name: 'Cocoapods',
            file: 'Podfile.lock'
        },
    ]
)

function Import() {
    const [canStart, setCanStart] = useState(false)
    const [provider, setProvider] = useState(fileTypes[0])
    return (
        <div className='Import'>
            <Stack spacing={2}>
                <Alert variant='outlined' severity='info'>
                Choose a Dependency manager then paste its resolved dependency graph file to start exploring
                </Alert>
                <TextField variant='outlined' defaultValue={provider.name} select label='Dependency manager'>
                    {fileTypes.map((item, index) => <MenuItem key={item.name} value={item.name} onClick={e => setProvider(fileTypes[index])}>{item.name}</MenuItem>)}
                </TextField>
                <TextField variant='outlined' multiline fullWidth label={provider.file} rows={8} onChange={e => { setCanStart(e.target.value != '') }} />
                <Button variant='contained' disabled={!canStart}>Start</Button>
                <Divider>or</Divider>
                <Button variant='outlined'>Try a demo</Button>
            </Stack>
        </div>
    )
}

export default Import