import React from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import { auth } from "../firebase";

function SettingsScreen() {
    const signout = () => auth.signOut();
    
    return <div className='my-6 max-w-screen-md mx-auto container'>
        <BackButton 
            href="/"
        />
        <Link className='flex items-center hover:bg-slate-100 p-2 border-b-2' to='steri'>
            <p className='text-sm flex-1'>
                Manage Sterilizers
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>
        <Link className='flex items-center hover:bg-slate-100 p-2 border-b-2' to='steri-items'>
            <p className='text-sm flex-1'>
                Manage Steri Items & Counts
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>
        <Link className='flex items-center hover:bg-slate-100 p-2 border-b-2' to='users'>
            <p className='text-sm flex-1'>
                Manage Users
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>
        <div className='my-6'>
            <Button onClick={signout}>Sign Out</Button>
        </div>
    </div>
}

export default SettingsScreen;
