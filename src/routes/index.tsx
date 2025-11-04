import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      <h1>Live Olympic Hockey Draft</h1>
    </div>
  )
}
