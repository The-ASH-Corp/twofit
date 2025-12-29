import BaseForm from '@/components/form/BaseForm';
import React from 'react'

const TherapyForm = () => {
    const fields = [
      {
        section: "Therapy Information",
        position: "left",
        fields: [
          {
            name: "name",
            label: "Therapy Name",
            type: "text",
          },
          {
            name: "Attach URL",
            label: "Attach URL",
            type: "text",
          },
          {
            name: "Notes",
            label: "Notes",
            type: "text",
          },
          {
            name: "Media Attachment",
            label: "Media Attachment",
            type: "number",
          },
        ],
      },
    ];
    const initialValues = {
      name: "",
    };
  return (
    <div>
            <BaseForm fields={fields} initialValues={initialValues} onSubmit={()=>{}}/>
          
        </div>
  )
}

export default TherapyForm