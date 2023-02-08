import React from 'react'
import {AiFillDelete} from "react-icons/ai"
import {BsSquare,BsCheckSquare} from 'react-icons/bs';

const TodoElem = ({todo,markAsDone,deleteTodo}) => {
  return (
    <div key={todo.id} className="flex bg-stone-100 font-semibold w-full items-center rounded-xl px-4 py-4 hover:bg-stone-300 transition duration-150">
                  <div className="flex-1 flex gap-4 items-center">
                     <label>
                         {todo.isChecked ? <BsCheckSquare/>:<BsSquare/>}
                     <input type="checkbox" onChange={()=>markAsDone(todo.id)} className="hidden"/>
                     </label>
                     <div>
                        <h1 className={todo.isChecked ? 'line-through text-gray-400 text-lg':'text-lg'}>{todo.text}</h1>
                        <h3 className='text-sm text-gray-500'>{todo.category.name}</h3>
                     </div>
                     </div>
                     <h4 className='text-sm text-gray-700 pr-6'>{todo.date}</h4>
                 <button  onClick={()=>deleteTodo(todo.id)} className="text-red-400 text-xl">
                 <AiFillDelete/></button>
            </div>
  )
}

export default TodoElem