"use client";
import { useSession } from 'next-auth/react';
import React from 'react'
import { options } from '../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

export default async function Member() {
  const {data:session} = useSession({
    required:true,
    onUnauthenticated(){
      redirect("/api/auth/signin?callbackUrl=/ClientMember")
    }
  });

  return (
    <div>
        <h1>Member Client Session</h1>
        <p>{session?.user.email}</p>
        <p>{session?.user.role}</p>
    </div>
  )
}
