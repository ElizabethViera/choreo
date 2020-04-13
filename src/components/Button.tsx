import * as React from 'react';
import {makeStyles} from '@material-ui/core/styles'
import MuiButton from '@material-ui/core/Button'

export default function ({variant='outlined', color='primary',...props} : React.ComponentProps<typeof MuiButton>) {
    
    return <MuiButton variant={variant} color={color} {...props} />
}