import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect } from "react"

interface Props{
 value:string
 onChange:(value:string)=>void
}

const RichEditor = ({value,onChange}:Props) => {

 const editor = useEditor({
  extensions:[StarterKit],
  content:value,
  onUpdate:({editor})=>{
   onChange(editor.getHTML())
  }
 })

 useEffect(()=>{
  if(editor && value !== editor.getHTML()){
   editor.commands.setContent(value)
  }
 },[value])

 return(
  <div className="border rounded p-2 min-h-[150px]">
   <EditorContent editor={editor}/>
  </div>
 )

}

export default RichEditor