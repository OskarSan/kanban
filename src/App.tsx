//import './App.css'
import Header from './components/Header'
import Board from './components/Board'


const cardEntries = [
  { title: "tasku", content: "tasku content", status: "todo" },
  { title: "tasku2", content: "tasku2 sisältö", status: "in-progress" },
  { title: "tasku3", content: "tasku3 content", status: "done" },
  
]


const cards = [
  { id: 5, title: 'ERRORS', content: [cardEntries[0],cardEntries[1],cardEntries[1],cardEntries[1]], status: 'todo' },
  { id: 1, title: 'To Do', content: [cardEntries[0]], status: 'todo' },
  { id: 2, title: 'In Progress', content: [cardEntries[1], cardEntries[2]], status: 'in-progress' },
  { id: 3, title: 'Done', content: [cardEntries[2], cardEntries[0], cardEntries[1]], status: 'done' },

]


function App() {

  return (
    <>
      <Header />      
      <Board cards = {cards}/>
    </>
  )
}

export default App
