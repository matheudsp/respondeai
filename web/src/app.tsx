import './db/future/storage'

import { useLiveQuery } from '@tanstack/react-db'
import { questions } from './db/collections/questions'
import { useState } from 'react'

export function App() {
  const [authorName, setAuthorName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data } = useLiveQuery(query => {
    return query
      .from({ questions })
      .select('@questions.id', '@questions.content', '@questions.author', '@questions.upvotes', '@questions.answered', '@questions.createdAt')
      .orderBy({ '@questions.upvotes': 'desc', '@questions.createdAt': 'desc' })
      .keyBy('@id')
  })

  async function handleSubmit() {
    const contentElement = document.getElementById('question-content') as HTMLTextAreaElement
    const content = contentElement?.value

    if (!content?.trim() || !authorName?.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      await fetch('http://localhost:3333/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          author: authorName.trim(),
        }),
      })

      // Clear form
      contentElement.value = ''
    } catch (error) {
      console.error('Failed to create question:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function upvoteQuestion(questionId: number) {
    try {
      await fetch(`http://localhost:3333/questions/${questionId}/upvote`, {
        method: 'PATCH',
      })
    } catch (error) {
      console.error('Failed to upvote question:', error)
    }
  }

  async function markAsAnswered(questionId: number) {
    try {
      await fetch(`http://localhost:3333/questions/${questionId}/answer`, {
        method: 'PATCH',
      })
    } catch (error) {
      console.error('Failed to mark as answered:', error)
    }
  }

  const unansweredQuestions = data.filter(q => !q.answered)
  const answeredQuestions = data.filter(q => q.answered)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            💬 Perguntas da Aula
          </h1>
          <p className="text-purple-200">
            Faça suas perguntas em tempo real e vote nas mais importantes
          </p>
        </div>

        {/* Question Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Seu nome..."
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
            <div>
              <textarea
                id="question-content"
                placeholder="Digite sua pergunta aqui..."
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? 'Enviando...' : '🚀 Enviar Pergunta'}
            </button>
          </div>
        </div>

        {/* Active Questions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🔥 Perguntas Ativas ({unansweredQuestions.length})
          </h2>
          
          {unansweredQuestions.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 text-center border border-white/10">
              <p className="text-purple-200 text-lg">
                Nenhuma pergunta ainda. Seja o primeiro a perguntar! 🤔
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {unansweredQuestions.map(question => (
                <div
                  key={question.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white text-lg mb-2">{question.content}</p>
                      <div className="flex items-center gap-4 text-sm text-purple-200">
                        <span>👤 {question.author}</span>
                        <span>🕒 {new Date(question.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => upvoteQuestion(question.id)}
                        className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 px-3 py-2 rounded-lg transition-colors duration-200"
                      >
                        👍 {question.upvotes}
                      </button>
                      <button
                        onClick={() => markAsAnswered(question.id)}
                        className="bg-green-500/20 hover:bg-green-500/40 text-green-200 px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                      >
                        ✅ Respondida
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answered Questions */}
        {answeredQuestions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              ✅ Perguntas Respondidas ({answeredQuestions.length})
            </h2>
            <div className="space-y-3">
              {answeredQuestions.map(question => (
                <div
                  key={question.id}
                  className="bg-green-500/10 backdrop-blur-lg rounded-xl p-4 border border-green-500/20 opacity-75"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white mb-2">{question.content}</p>
                      <div className="flex items-center gap-4 text-sm text-green-200">
                        <span>👤 {question.author}</span>
                        <span>👍 {question.upvotes}</span>
                        <span>🕒 {new Date(question.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="text-green-400 text-xl">✅</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}