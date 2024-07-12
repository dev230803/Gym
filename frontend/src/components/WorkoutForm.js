import React, { useState } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutConntext'
import { useAuthContext } from '../hooks/useAuthContext';

function WorkoutForm() {
    const {dispatch}=useWorkoutsContext();
    const[title,SetTitle]=useState('')
    const[load,SetLoad]=useState('')
    const[reps,SetReps]=useState('')
    const[error,SetError]=useState(null)
    const {user}=useAuthContext()

    const handleSubmit= async(e)=>{
        e.preventDefault()
         if(!user){
            SetError('You must be logged in!')
            return 
         }
        const workout={title,load,reps}

        const response= await fetch('/api/workouts',{
            method:'POST',
            body:JSON.stringify(workout),
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json=await response.json();
        if(!response.ok){
            SetError(json.error)
        }
        if(response.ok){
            SetTitle('')
            SetReps('')
            SetLoad('')
            SetError(null)

            console.log('Workout added',json);
            dispatch({type:'CREATE_WORKOUT',payload:json})
        }
    }
  return (
    <form action="" className="create" onSubmit={handleSubmit}>
        <h3>Add a new Workout</h3>

        <label>Exercise Title:</label>
        <input type='text' onChange={(e)=>{SetTitle(e.target.value)}} value={title} required></input>

        <label>Load(in Kg):</label>
        <input type='number' onChange={(e)=>{SetLoad(e.target.value)}} value={load} required></input>
        <label>Reps:</label>
        <input type='number' onChange={(e)=>{SetReps(e.target.value)}} value={reps} required></input>
        <button>Add a Workout</button>
        {error && <div className="error">{error}</div> }
    </form>
  )
}

export default WorkoutForm
