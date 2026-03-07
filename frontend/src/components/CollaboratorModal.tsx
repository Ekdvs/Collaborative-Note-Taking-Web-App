import { useState } from "react"
import { Axios } from "../utils/Axios"
import SummaryApi from "../api/SummaryApi"
import toast from "react-hot-toast"

interface Props{
 note:any
 close:()=>void
 refresh:()=>void
}

const CollaboratorModal = ({note,close,refresh}:Props) => {

 const [email,setEmail] = useState("")

 const addCollaborator = async()=>{

  try{

  const res= await Axios({
    url: SummaryApi.addCollaborator.url(note._id),
    method: SummaryApi.addCollaborator.method,
    data:{email,role:"editor"}
   })

   if (res.data.success) {
     toast.success(res.data.message || "Collaborator added");
     refresh();
     close();
   } else {
     toast.error(res.data.message || "Failed to add collaborator");
   }

  }catch{
   toast.error("Failed")
  }

 }

 const removeCollaborator = async(userId:string)=>{

  await Axios({
   url: SummaryApi.removeCollaborator.url(note._id,userId),
   method: SummaryApi.removeCollaborator.method
  })

  refresh()

 }

 return(

  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

   <div className="bg-white p-6 rounded w-[400px]">

    <h2 className="text-lg font-bold mb-4">Collaborators</h2>

    <div className="flex gap-2 mb-4">

     <input
      placeholder="User email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      className="border p-2 flex-1"
     />

     <button
      onClick={addCollaborator}
      className="bg-blue-600 text-white px-3 py-2 rounded"
     >
      Add
     </button>

    </div>

    {note.collaborators?.map((c:any)=>(
     <div key={c.user} className="flex justify-between mb-2">

      <span>{c.user}</span>

      <button
       onClick={()=>removeCollaborator(c.user)}
       className="text-red-500"
      >
       Remove
      </button>

     </div>
    ))}

    <button
     onClick={close}
     className="mt-4 bg-gray-300 px-4 py-2 rounded"
    >
     Close
    </button>

   </div>

  </div>

 )

}

export default CollaboratorModal