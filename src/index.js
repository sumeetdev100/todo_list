import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import { v4 as uuidv4 } from 'uuid';
import {BsListCheck} from 'react-icons/bs';
import TodoElem from './components/todoElem';
import {FaFilter} from "react-icons/fa";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const App = ()=>{
  const [todo,setTodo] = useState('');
  const [todos,setTodos] = useState([]);
  const [searchResults,setSearchResults] = useState([]);

  const [mode,setMode] = useState('normal');

  const [newCategory, setNewCategory] = useState('');
  const [showCategory, setShowCategory] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [categoryFilterResult, setCategoryFilterResult] = useState([]);
  const [categories, setCategories] = useState([{id:1,name:'default'},{id:2,name:'office'},{id:3,name:'classroom'}]);
  const [selectedCategory,setSelectedCategory] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null)

  const [startDate, setStartDate] = useState(new Date());
  const [startFilterDate, setStartFilterDate] = useState(new Date());
  const [endFilterDate, setEndFilterDate] = useState(new Date());

  const searchRef = useRef();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('todos'));
    if (items) {
     setTodos(items);
    }

    const categoryList = JSON.parse(localStorage.getItem('categories'));
    if(categoryList){
      setCategories(categoryList);
    }
  }, []);

  useEffect(()=>{
    localStorage.setItem("todos",JSON.stringify(todos))
  },[todos])

  
  useEffect(()=>{
    localStorage.setItem("categories",JSON.stringify(categories))
  },[categories])

  const addTodos = ()=>{
    if(todo.trim().length>0 && selectedCategory!==null)
   { setTodos(prev=>[{
      id:uuidv4(),
      text:todo,
      isChecked:false,
      category:selectedCategory,
      date:startDate.toDateString()
    },...prev]);
    setTodo('');
    setSelectedCategory(null)
    setSelectedCategoryFilter(null)
    searchRef.current.value='';
    setMode('normal');
  }
  }

  const addCategories = ()=>{
    if(newCategory.trim().length>0)
    setCategories(prev=>[{
      id:uuidv4(),
      name:newCategory
    },...prev]);
    setNewCategory('');
  };

  const deleteTodo = (id)=>{
    setTodos(prev=>prev.filter(item=>item.id!==id));
    if(mode==='search'){
      setSearchResults(searchResults.filter(item=>item.id!==id));
    };
    if(categoryFilterResult.length!==0)
      setCategoryFilterResult(categoryFilterResult.filter(item=>(item.id!==id)))
  }

  const markAsDone = (id)=>{
    setTodos(prev=>prev.map(item=>{
      if(item.id===id){
        item.isChecked = !item.isChecked;
      }
      return item
    }))
  }

  const searchTodo = (searchTerm)=>{
    if(searchTerm.trim().length>0){
      if(categoryFilterResult.length===0)
      setSearchResults(todos.filter(item=>item.text.includes(searchTerm)));
      else
      setSearchResults(categoryFilterResult.filter(item=>item.text.includes(searchTerm)));
      setMode('search')
    }
    else
    setMode('normal')
  }

  const filterCategory = (category)=>{
    if(category===null){
      setMode('normal');
    }
    else{
      setCategoryFilterResult(todos.filter(item=>item.category.id===category.id));
      setMode('filter')
    }
  }

  const filterTodo = ()=>{
    const start = new Date(startFilterDate).getTime();
    const end = new Date(endFilterDate).getTime();

    setCategoryFilterResult(todos.filter(item=>{
      const itemDate = new Date(item.date).getTime();
      return (itemDate >= start && itemDate <= end)
    }));

    console.log(categoryFilterResult)
    setMode('filter')
  }

  return (
<div className='flex relative w-full justify-center bg-stone-500 overflow-hidden'>
    <div className="absolute top-0 bottom-0 left-0 right-0 h-full w-full">
        <img className="h-full w-full object-cover" src="https://static.vecteezy.com/system/resources/previews/000/247/824/original/vector-beautiful-landscape-illustration.jpg"/>
    </div>
    <div className="backdrop-brightness-75 flex justify-center md:px-8 h-screen w-full">
        <div className="mt-4 md:mt-4 w-[90%] md:w-[60%] lg:w-[55%] z-10 glass p-3 md:p-8">
            <h1 className="w-full text-4xl font-bold text-white flex items-center justify-center"> 
                <span className=''><BsListCheck/></span>
                <span className="ml-4">To do List</span>
            </h1>
            <br/>
            <div className="flex flex-col justify-start gap-1 mt-4">
                <label htmlFor="todo" className="text-white font-semibold text-lg pb-4">Add To-Do</label>
               <div className="flex">
                <input id="todo" value={todo} name="todo" type="text" className="w-full p-3 rounded-l-xl" onChange={e=>setTodo(e.target.value)}/>
                <div className=' bg-white font-semibold bg-[#241F30] text-white'>
                  <button onClick={()=>{
                    setShowCategory(prev=>!prev)
                    }} className='w-full  px-4 py-3 h-full hover:bg-green-400 hover:text-black transition duration-300'>{selectedCategory===null?'Category':`${selectedCategory.name}`}</button>
                
                 {showCategory ?  
                 <div className='w-screen backdrop-brightness-50 z-40 h-screen absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center' id='category-backdrop' onClick={(e)=>{
                  if(e.target.id==='category-backdrop')               
                  setShowCategory(false)}}>
                  <div className='pb-2 border-2 border-[#241F30] shadow-lg w-72 max-h-[300px] bg-stone-200 px-2 flex flex-col gap-2 pt-4 rounded-lg'>
                 <div className='flex flex-col gap-2 overflow-y-auto'>
                 {categories.map((category)=><div 
                  key={category.id} 
                  onClick={()=>{
                    setSelectedCategory(category);
                    setShowCategory(false)
                  }}
                  className='w-full rounded-lg bg-stone-300 text-black p-2 hover:bg-stone-700 hover:text-white shadow-md'>
                    <h3>{category.name}</h3>
                  </div>)}
                  </div>
                  <div className='w-full flex mt-8'>
                  <input id="category" value={newCategory} name="category" type="text" className="w-full p-2 rounded-l-md text-black" onChange={e=>setNewCategory(e.target.value)}/>
                  <button onClick={addCategories} className='bg-green-400 px-3 rounded-r-md text-black'>Add</button>
                    </div>
                  </div>
                 </div>:null}

                </div>
                <div>
                <DatePicker dateFormat="yyyy/MM/dd" className='cursor-pointer bg-orange-300 rounded-r-lg p-4 w-full text-center font-semibold' selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
               </div>
               <div className='w-full flex justify-center'>
               <button onClick={addTodos} className="w-48 mt-4 font-semibold p-4 rounded-xl bg-[#241F30] text-white hover:bg-green-400 hover:text-black transition duration-300">Add</button>
               </div>
            </div>
            <div className="mt-4 flex">
                    <input type="text" ref={searchRef} id="search" onChange={(e)=>searchTodo(e.target.value)} className="w-full p-3 rounded-l-xl text-center" placeholder="search to-dos"/>
                    <button className='bg-stone-800 text-white rounded-r-xl px-4' onClick={()=>setShowCategoryFilter(prev=>!prev)}><FaFilter/></button>
                    
                    
                    {showCategoryFilter ?  
                    <div 
                    id='filter-backdrop'
                    onClick={(e)=>{
                      if(e.target.id==='filter-backdrop'){
                        setShowCategoryFilter(false)
                      }
                    }}
                    className='w-screen backdrop-brightness-50 z-40 h-screen absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center'>
                      <div className='pb-2 relative border-2 border-stone-700 shadow-lg w-[50%] h-[400px] bg-stone-200 px-2 flex gap-2 pt-4 rounded-lg'>
                <div className='w-[60%]'>
                 <div className='flex flex-col gap-2 h-full overflow-y-auto relative'>
                 {categories.map((category)=><div 
                  key={category.id} 
                  onClick={()=>{
                    setSelectedCategoryFilter(category);
                    filterCategory(category);
                    setShowCategoryFilter(false);
                  }}
                  className={`w-full rounded-lg bg-stone-300 text-black p-2 hover:bg-stone-700 hover:text-white shadow-md ${selectedCategoryFilter?.id === category.id ? 'bg-green-400':''}`}>
                    <h3>{category.name}</h3>
                  </div>)}
                  </div>
                </div>  
                  <div className='flex flex-col gap-2 px-4 w-[40%]'>
                    <h1 className='my-2 font-semibold'>Start Date</h1>
                    <DatePicker dateFormat="yyyy/MM/dd" className='cursor-pointer bg-orange-300 rounded-lg p-4 w-full shadow-lg border-2 text-center font-semibold' selected={startFilterDate} onChange={(date) => setStartFilterDate(date)} />
                    <h1 className='my-2 font-semibold'>End Date</h1>
                    <DatePicker dateFormat="yyyy/MM/dd" className='cursor-pointer bg-orange-300 rounded-lg p-4 w-full shadow-lg border-2 text-center font-semibold' selected={endFilterDate} onChange={(date) => setEndFilterDate(date)} />
                  <div className='flex justify-between'>
                  <button
                   onClick={filterTodo}
                   className='bg-green-400  font-bold text-lg p-3 mt-4 rounded-lg'>Filter</button>
                   <div 
                  onClick={()=>{
                    setSelectedCategoryFilter(null)
                    filterCategory(null);
                    setShowCategoryFilter(false);
                  }}
                  className='rounded-lg font-bold text-lg p-3 mt-4 bg-red-300 hover:bg-stone-700 hover:text-white shadow-md'>
                    <h3>No Filter</h3>
                  </div>
                  </div>
                  
                  </div>
                  
                  </div>
                      </div>:null}


            </div>

            {mode==='normal'? <div className="mt-4 flex flex-col gap-2 shadow-lg max-h-[60%] overflow-y-auto">
              {todos.map(todo=>
                 <TodoElem key={todo.id} todo={todo} markAsDone={markAsDone} deleteTodo={deleteTodo}/>)}
            </div>:null}

            {mode==='filter'? <div className="mt-4 flex flex-col gap-2 shadow-lg max-h-[60%] overflow-y-auto">
              {categoryFilterResult.map(todo=>
                 <TodoElem key={todo.id}  todo={todo} markAsDone={markAsDone} deleteTodo={deleteTodo}/>)}
            </div>:null}

            {mode==='search' ? <div className="mt-4 flex flex-col gap-2 shadow-lg max-h-[60%] overflow-y-auto">
              {searchResults.length>0 ? searchResults.map(todo=>
                  <TodoElem key={todo.id}  todo={todo} markAsDone={markAsDone} deleteTodo={deleteTodo}/>) :
                  <div className='bg-stone-300 text-center py-4 rounded-xl font-semibold'>No Matching Results</div>}
            </div>: null}
           </div>
    </div>
</div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App/>
);