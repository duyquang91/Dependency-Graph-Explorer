import React, { useContext, useState } from 'react'
import { Alert, Button, Card, CardContent, Divider, MenuItem, Stack, TextField } from '@mui/material'
import { dependencyManagerProviders } from './DependencyManagerProviders/DependencyManagerProviders'
import { IsMobileContext } from './Base'
import { useNavigate } from 'react-router-dom'

function Import() {
    const navigate = useNavigate()
    const [text, setText] = useState('')
    var selectedIndex = 0
    const [provider, setProvider] = useState(dependencyManagerProviders[0])
    const isMobile: Boolean = useContext(IsMobileContext)
    const selectIndex = (e: React.MouseEvent, i: number) => {
        selectedIndex = i
        setProvider(dependencyManagerProviders[i])
    }
    const startParsing = (e: React.MouseEvent) => {
        provider.updateResolvedFile(text)
        navigate('/graphViewer/{selectedIndex}')
    }

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
                            <Alert variant='outlined' severity='info'>Choose a Dependency manager then paste its resolved dependency graph file to start exploring</Alert>
                            <TextField variant='outlined' defaultValue={provider.name} select label='Dependency manager'>
                                {dependencyManagerProviders.map((item, index) => <MenuItem key={item.name} value={item.name} onClick={(e) => {selectIndex(e, index)}}>{item.name} </MenuItem>)}
                            </TextField>
                            <TextField variant='outlined' multiline fullWidth label={provider.resolvedFileName} rows={8} value={text} onChange={(e) => {setText(e.target.value)}} />
                            <Button variant='contained' disabled={text === ''} onClick={(e) => {startParsing(e)}}>Start</Button>
                            <Divider>or</Divider>
                            <Button variant='outlined' onClick={(e) => navigate('/graphViewer')}>Try a demo</Button>
                        </Stack>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default Import