import BaseTable from '@/components/table/BaseTable'
import React, { useEffect, useState } from 'react'
import { feedbackColumns } from './Feedbackolumns'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/redux/store/hooks'
import { selectUser } from '@/redux/features/auth/auth.selectores'
import { getAllFeedbacks } from '@/redux/features/client/client.thunk'

export default function FeedbackList() {
  const user = useAppSelector(selectUser)
  const [feedbackData, setFeedbackData] = useState([])
  const dispatch = useDispatch()
  const fetchFeedbackData = async () => {
    const response = await dispatch(getAllFeedbacks(user._id))
    const data = await response.payload
    
    // Flatten the nested feedback data structure
    const flattenedData = data?.flatMap(coach => 
      coach.feedback.map(fb => ({
        coachId: coach._id,
        name: coach.name 
          ? coach.name.charAt(0).toUpperCase() + coach.name.slice(1) 
          : 'N/A',
        role: coach.role || 'N/A',
        rating: fb.rating,
        review: fb.feedback,
        date: new Date(fb.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        _id: fb._id
      }))
    ) || []
    
    setFeedbackData(flattenedData)
  }
  useEffect(() => {
    fetchFeedbackData()
  }, [])  
  
  return (
    <div>
      <BaseTable columns={feedbackColumns} data={feedbackData}/>
    </div>
  )
}
