import BaseForm from '@/components/form/BaseForm'
import React from 'react'

export default function CategoryForm() {
    const fields=[
        
        {section:"Category Information",
        position:"left",
        fields:[{name:"name" ,label:"Category Name",type:"text"}]
        }
    ]
    const initialValues={
        name:""
    }
  return (
    <div>
        <BaseForm fields={fields} initialValues={initialValues} onSubmit={()=>{}}/>
      
    </div>
  )
}
