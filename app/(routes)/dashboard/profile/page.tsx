import { UserProfile } from '@clerk/nextjs'
import React from 'react'

function Profile() {
    return (
        <div className='flex justify-center items-center mt-10'>
            <UserProfile routing="hash" />
        </div>
    )
}

export default Profile
