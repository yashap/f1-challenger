import { Button, TextField } from '@mui/material'
import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router'
import { ChallengerClientBuilder } from 'src/apiClient/ChallengerClientBuilder'

interface FormData {
  name: string
  description?: string
}

const initialFormData: FormData = {
  name: '',
}

export const CreateLeaguePage = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const navigate = useNavigate()

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const client = ChallengerClientBuilder.build()
    const doSubmit = async () => {
      try {
        const league = await client.leagues.create({
          name: formData.name,
          description: formData.description === '' ? undefined : formData.description,
        })
        await navigate(`/leagues/${league.id}`)
      } catch (error) {
        // TODO: toast
        window.alert(`Error: ${(error as Error).message}`)
      }
    }
    void doSubmit()
  }

  return (
    <form onSubmit={onSubmit}>
      <TextField
        label='Name'
        fullWidth
        margin='normal'
        value={formData.name}
        onChange={(event) => {
          setFormData({ ...formData, name: event.target.value })
        }}
        required
      />
      <TextField
        label='Description'
        fullWidth
        margin='normal'
        value={formData.description}
        onChange={(event) => {
          setFormData({ ...formData, description: event.target.value })
        }}
      />
      <Button variant='contained' color='primary' type='submit'>
        Submit
      </Button>
    </form>
  )
}
