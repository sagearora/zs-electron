import './App.css';

import React from 'react'

function App() {
  const test = () => {
    window.electron.ipcRenderer.sendMessage('zs-message', ['print-label', [
      {
        qr: 'zs/label_1',
        user: 'Rebecca Leitch',
        content: 'Lots of love',
      }
    ]])
  }
  return (
    <div className='bg-green-100 w-full h-screen'>
        <div className='text-2xl font-bold'>TESTING</div>
        <button className='p-4 bg-slate-200' onClick={test}>Press Me</button>
    </div>
  )
}

export default App
