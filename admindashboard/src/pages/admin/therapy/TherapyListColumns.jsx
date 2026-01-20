import { Navigation2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

 
export const therapyListColumns=[
        {accessorKey:"name",label:"Therapy Type"},
        {accessorKey:"description",label:"Description"},
        {accessorKey:"status",label:"Status"},
        {id:'actions',header:"Actions",cell:({row})=>(<Actioncell row={row}/>)}

    
    ]


    const Actioncell=({row})=>{

        const navigate=useNavigate()
        

        if(hasPlans){
            navigate('/admin/therapy/plans')
        }else{
            navigate('/admin/therapy/create')
        }
    }

    // return(
    //     <button>Add Therapy</button>
    // )
