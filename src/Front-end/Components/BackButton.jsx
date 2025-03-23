import React from 'react'
import { useNavigate } from 'react-router'

export default function BackButton() {
    const navigate = useNavigate();
    function handleBack(){
   navigate('-1')
    }
  return (
    <button onClick={handleBack}>Back</button>
  )
}
