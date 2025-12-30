import BaseForm from '@/components/form/BaseForm';
import { createTherapy } from '@/redux/features/therapy/therapy.thunk';
import React from 'react'
import { useDispatch } from 'react-redux';

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
            name: "sets",
            label: "Sets",
            type: "text",
          },
          {
            name: "attachment",
            label: "Attachment",
            type: "text",
          },
          {
            name: "media",
            label: "Media Attachment",
            type: "file",
          },
        ],
      },
    ];
    const initialValues = {
      name: "",
      sets: "",
      attachment: "",
      media: null,
    };

  const dispatch = useDispatch();


    const handelSubmit = (value) => {
      console.log(value);
      const formData = new FormData();

      formData.append("name", value.name);
      formData.append("sets", value.sets);
      formData.append("attachment", value.attachment);

      if (value.media) {
        formData.append("media", value.media); // ✅ FILE
      }
      console.log(formData)
      dispatch(createTherapy(formData));;
    };

  return (
    <div>
            <BaseForm fields={fields} initialValues={initialValues} onSubmit={(value)=> handelSubmit(value)}/>
          
        </div>
  )
}

export default TherapyForm