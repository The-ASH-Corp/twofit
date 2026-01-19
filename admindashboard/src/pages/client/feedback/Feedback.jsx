import React from 'react'
import ExpertCard from './ExpertCard'
import FeedbackList from './FeedbackList'
import MobileBottomNav from '../components/MobileBottomNav'

export default function Feedback() {
  return (
    <div className='flex flex-col gap-5'>
     <ExpertCard/>
     <FeedbackList/>
     <MobileBottomNav />
    </div>
  )
}
