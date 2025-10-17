import { useState } from 'react'
import BasicLayout from './layout/BasicLayout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BasicLayout />
    </>
  )
}

export default App
