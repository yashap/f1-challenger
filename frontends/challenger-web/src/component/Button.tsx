import { Button as LibButton, ButtonProps as LibButtonProps } from '@mui/material'
import React from 'react'

export type ButtonProps = LibButtonProps

export const Button = (props: ButtonProps) => <LibButton variant='contained' {...props} />
