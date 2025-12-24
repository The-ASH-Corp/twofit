import { socket } from '@/utils/socket';
import React, { useEffect } from 'react'

export default function Dashboard() {

useEffect(() => {
  socket.connect();

  return () => socket.disconnect();
}, []);

  return (
    <div>
      dashhhh
    </div>
  )
}
