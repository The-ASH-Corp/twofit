import React from 'react'
import ExpertCard from './ExpertCard'
import FeedbackList from './FeedbackList'

export default function Feedback() {
  return (
    <div className='flex flex-col gap-5'>
     <ExpertCard/>
     <FeedbackList/>
    </div>
  )
}
