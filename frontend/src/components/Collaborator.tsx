import { useState } from "react"
import { Axios } from "../utils/Axios"
import SummaryApi from "../api/SummaryApi"
import type { Note } from "../type/note"


interface Props{
  note:Note
  refresh:()=>void
}

const Collaborator = ({note,refresh}:Props) => {

  const [email,setEmail] = useState("")

  const addCollaborator = async()=>{

    await Axios({
      url: SummaryApi.addCollaborator.url(note._id),
      method: SummaryApi.addCollaborator.method,
      data:{email}
    })

    refresh()
  }

  const removeCollaborator = async(userId:string)=>{

    await Axios({
      url: SummaryApi.removeCollaborator.url(note._id,userId),
      method: SummaryApi.removeCollaborator.method
    })

    refresh()
  }

  return (

    <div className="mt-4">

      <input
        placeholder="Collaborator email"
        className="border p-1 mr-2"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <button
        onClick={addCollaborator}
        className="bg-blue-500 text-white px-2 py-1"
      >
        Add
      </button>

      <div className="mt-2">

        {note.collaborators?.map((c:any)=>(
          <div key={c.user} className="flex gap-2">

            <span>{c.user}</span>

            <button
              onClick={()=>removeCollaborator(c.user)}
              className="text-red-500"
            >
              Remove
            </button>

          </div>
        ))}

      </div>

    </div>
  )
}

export default Collaborator