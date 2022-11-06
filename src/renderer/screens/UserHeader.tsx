import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../lib/Button';
import { useUser } from '../services/user.context';

function UserHeader() {
    const navigate = useNavigate();
    const {
        user,
        endSession
    } = useUser()

    const endSessionRoute = () => {
        navigate('/')
        endSession();
    }

    return (
        <div>
            <Button onClick={endSessionRoute}>End Session ({user.name})</Button>
        </div>
    )
}

export default UserHeader