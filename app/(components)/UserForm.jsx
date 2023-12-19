"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function UserForm() {
    const router= useRouter();
    const [ formData, setFormData ] = useState({

    })
    const [errorMessage, setErrorMessage ] = useState("")

    const handleChange = (e)=>{
        const value = e.target.value
        const name = e.target.name
        setFormData(prev=>({...prev, [name]:value}))
        
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        setErrorMessage("")
        const res = await fetch("/api/Users", {
            method:"POST",
            body: JSON.stringify(formData),
            "content-type":"application/json"
        })
        if(!res.ok){
            const response = await res.json()
            setErrorMessage(response.message);
        }else{
            router.refresh()
            router.push("/")
        }
    }

    
  return (
    <>
        <form onSubmit={handleSubmit} method='post'className='flex flex-col gap-3 w-1/2'>
            <h1>Create new User</h1>
            <label htmlFor="name">Full Name</label>
            <input 
                type="text" 
                id='name'
                name='name'
                onChange={handleChange} 
                required 
                value={formData.name} 
                className='m-2 bg-slate-400 rounded'
            />
            <label htmlFor="email">Email</label>
            <input 
                type="email" 
                id='email'
                name='email'
                onChange={handleChange} 
                required 
                value={formData.email} 
                className='m-2 bg-slate-400 rounded'
            />
            <label htmlFor="password">Password</label>
            <input 
                type="password" 
                id='password'
                name='password'
                onChange={handleChange} 
                required 
                value={formData.password} 
                className='m-2 bg-slate-400 rounded'
            />
            <input 
                type="submit"
                value="Create User" 
                className='bg-blue-300 hover:bg-blue-100' 
            />
        </form>
        <p>{errorMessage}</p>
    </>
  )
}

export default UserForm