import './db/future/storage'

import { useLiveQuery, useOptimisticMutation } from '@tanstack/react-db'
import { issues } from './db/collections/issues'
import { users } from './db/collections/users'

export function App() {
  const { data } = useLiveQuery(query => {
    return query
      .from({ issues })
      .join({
        type: 'inner',
        from: { users },
        on: ['@users.id', '=', '@issues.userId'],
      })
      .select('@issues.id', '@issues.title', '@issues.createdAt', '@users.name')
      .limit(5)
      .orderBy({ '@issues.id': 'desc' })
      .keyBy('@id')
  })

  const createIssueMutation = useOptimisticMutation({
    mutationFn: async ({ transaction }) => {
      const { collection, modified } = transaction.mutations[0]

      console.log({ modified })

      // await fetch('http://localhost:3333/issues', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     userId: 1,
      //     title: modified.title,
      //   }),
      // })

      await collection.commitPendingTransactions
    },
  })

  async function createIssue(data: FormData) {
    const title = data.get('title')?.toString()

    if (!title?.trim()) {
      return
    }

    await fetch('http://localhost:3333/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 1,
        title,
      }),
    })

    // createIssueMutation.mutate(() => {
    //   issues.insert({
    //     id: Math.round(Math.random() * 100000),
    //     title,
    //     description: null,
    //     userId: 1,
    //     createdAt: new Date().toISOString(),
    //   })
    // })
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="font-bold text-xl">Issues</h1>

      <form action={createIssue} className="flex flex-col items-end gap-3">
        <textarea
          name="title"
          placeholder="Create new issue..."
          className="bg-[#17181A] text-sm outline-none shadow-sm p-4 rounded-lg inset-ring-1 inset-ring-white/5 w-full resize-y ring-indigo-500 focus:ring-1"
        />

        <button
          type="submit"
          className="bg-indigo-500 text-white text-sm rounded-lg px-3 h-7 inset-ring-1 inset-ring-white/5 font-medium cursor-pointer hover:bg-indigo-600"
        >
          Create issue
        </button>
      </form>

      <div className="h-px w-full bg-zinc-900" />

      <ul className="space-y-3">
        {data.map(item => {
          return (
            <li
              key={item.id}
              className="bg-[#17181A] shadow-sm p-4 rounded-lg inset-ring-1 inset-ring-white/5 space-y-2"
            >
              <p>{item.createdAt}</p>
              <p className="text-xs text-zinc-400">
                ISS-{String(item.id).padStart(3, '0')}
              </p>
              <p className="text-sm">{item.title}</p>
              <p className="text-sm text-zinc-400">{item.name}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
