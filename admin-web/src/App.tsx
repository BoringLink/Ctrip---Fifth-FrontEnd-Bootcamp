import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { App as AntApp } from 'antd'

export default function App() {
  return (
    <AntApp>
      <RouterProvider router={router} />
    </AntApp>
  )
}
