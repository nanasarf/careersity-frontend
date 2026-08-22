import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  useGetAssessmentAttemptHistoryQuery,
  useGetEnrollmentAssessmentsQuery,
  useLazyGetAssessmentAttemptQuery,
  useSaveAssessmentResponsesMutation,
  useStartAssessmentAttemptMutation,
  useSubmitAssessmentAttemptMutation,
} from '../../features/learning-plans/api/enrollmentsApi'
import { ApiErrorNotice } from '../../features/learning-plans/components/LearnerUi'
import type { AssessmentAttemptDetailDto, AssessmentAttemptStartDto, SaveAssessmentResponseRequest } from '../../types/api'

type Answers = Record<string, string[]>

export default function LearnerAssessmentPage() {
  const { enrollmentId, courseId, assessmentId } = useParams<{ enrollmentId: string; courseId: string; assessmentId: string }>()
  const base = useMemo(() => ({ enrollmentId: enrollmentId ?? '', courseId: courseId ?? '', assessmentId: assessmentId ?? '' }), [assessmentId, courseId, enrollmentId])
  const summaries = useGetEnrollmentAssessmentsQuery({ enrollmentId: base.enrollmentId, courseId: base.courseId }, { skip: !enrollmentId || !courseId })
  const history = useGetAssessmentAttemptHistoryQuery(base, { skip: !enrollmentId || !courseId || !assessmentId })
  const [startAttempt, startState] = useStartAssessmentAttemptMutation()
  const [loadDetail] = useLazyGetAssessmentAttemptQuery()
  const [saveResponses, saveState] = useSaveAssessmentResponsesMutation()
  const [submitAttempt, submitState] = useSubmitAssessmentAttemptMutation()
  const [attempt, setAttempt] = useState<AssessmentAttemptStartDto | null>(null)
  const [result, setResult] = useState<AssessmentAttemptDetailDto | null>(null)
  const [answers, setAnswers] = useState<Answers>({})
  const [saveLabel, setSaveLabel] = useState('')
  const initialized = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestQueued = useRef<SaveAssessmentResponseRequest[] | null>(null)
  const saveChain = useRef<Promise<void>>(Promise.resolve())

  const snapshot = useCallback((value: Answers): SaveAssessmentResponseRequest[] =>
    Object.entries(value).map(([questionId, selectedAnswerOptionIds]) => ({ questionId, selectedAnswerOptionIds })), [])

  const flush = useCallback((): Promise<void> => {
    if (!attempt || !latestQueued.current) return saveChain.current
    const responses = latestQueued.current
    latestQueued.current = null
    saveChain.current = saveChain.current.catch(() => undefined).then(async () => {
      setSaveLabel('Saving…')
      try {
        await saveResponses({ ...base, attemptId: attempt.attemptId, responses }).unwrap()
        setSaveLabel('Saved')
      } catch {
        setSaveLabel('Save failed')
      }
    })
    return saveChain.current
  }, [attempt, base, saveResponses])

  const queueSave = useCallback((value: Answers) => {
    latestQueued.current = snapshot(value)
    setSaveLabel('Unsaved changes')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => void flush(), 700)
  }, [flush, snapshot])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  useEffect(() => {
    if (initialized.current || !enrollmentId || !courseId || !assessmentId) return
    initialized.current = true
    void startAttempt(base).unwrap().then(async (started) => {
      setAttempt(started)
      const detail = await loadDetail({ ...base, attemptId: started.attemptId }).unwrap()
      setAnswers(Object.fromEntries(detail.responses.map((response) => [response.questionId, [...response.selectedAnswerOptionIds]])))
    }).catch(() => undefined)
  }, [assessmentId, base, courseId, enrollmentId, loadDetail, startAttempt])

  const summary = summaries.data?.find((item) => item.assessmentId === assessmentId)
  const questions = attempt?.questions.slice().sort((a, b) => a.order - b.order) ?? []
  const allAnswered = questions.length > 0 && questions.every((question) => (answers[question.questionId]?.length ?? 0) > 0)

  const selectSingle = (questionId: string, optionId: string) => setAnswers((current) => {
    const next = { ...current, [questionId]: [optionId] }; queueSave(next); return next
  })
  const toggleMultiple = (questionId: string, optionId: string) => setAnswers((current) => {
    const selected = current[questionId] ?? []
    const nextSelected = selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId]
    const next = { ...current, [questionId]: nextSelected }; queueSave(next); return next
  })

  const submit = async () => {
    if (!attempt || !allAnswered) return
    if (timer.current) clearTimeout(timer.current)
    latestQueued.current = snapshot(answers)
    await flush()
    const submitted = await submitAttempt({ ...base, attemptId: attempt.attemptId, responses: snapshot(answers) }).unwrap()
    setResult(submitted)
    await history.refetch()
    await summaries.refetch()
  }

  if (summaries.isLoading || startState.isLoading) return <div className="h-64 animate-pulse rounded-xl bg-gray-200" />

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to={`/learning/enrollments/${enrollmentId}/courses/${courseId}`} className="text-sm text-blue-600 hover:underline">← Course</Link>
      <header className="rounded-xl border bg-white p-6"><h1 className="text-3xl font-bold text-gray-900">{summary?.title ?? 'Assessment'}</h1>{summary?.description && <p className="mt-2 text-gray-600">{summary.description}</p>}{summary && <p className="mt-3 text-sm text-gray-500">Pass mark {summary.passingScorePercentage}% · Attempts used {summary.attemptsUsed} · {summary.attemptsRemaining == null ? 'Unlimited attempts remaining' : `${summary.attemptsRemaining} attempts remaining`}</p>}</header>
      <ApiErrorNotice error={startState.error ?? saveState.error ?? submitState.error} />

      {result ? <section className={`rounded-xl border p-6 ${result.passed ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}><h2 className="text-2xl font-bold">{result.passed ? 'Passed' : 'Not passed'}</h2><p className="mt-2 text-lg">Score: {result.scorePercentage?.toFixed(0) ?? 0}%</p><p className="mt-1 text-sm">{result.pointsEarned ?? 0} of {result.totalPoints ?? 0} points</p>{!result.passed && (summary?.attemptsRemaining == null || summary.attemptsRemaining > 0) && <button onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">Try again</button>}</section> : (
        <form onSubmit={(event) => { event.preventDefault(); void submit() }} className="space-y-5">
          {questions.map((question, index) => <fieldset key={question.questionId} className="rounded-xl border bg-white p-6"><legend className="px-1 font-semibold text-gray-900">{index + 1}. {question.prompt} <span className="text-xs font-normal text-gray-400">({question.points} points)</span></legend>{question.questionType === 'MultipleChoice' && <p className="mt-2 text-xs text-gray-500">Select all that apply.</p>}<div className="mt-4 space-y-2">{question.answerOptions.slice().sort((a,b) => a.order-b.order).map((option) => { const multiple = question.questionType === 'MultipleChoice'; const checked = (answers[question.questionId] ?? []).includes(option.answerOptionId); return <label key={option.answerOptionId} className={`flex cursor-pointer gap-3 rounded-lg border p-3 ${checked ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}><input type={multiple ? 'checkbox' : 'radio'} name={question.questionId} checked={checked} onChange={() => multiple ? toggleMultiple(question.questionId, option.answerOptionId) : selectSingle(question.questionId, option.answerOptionId)} className="mt-1"/><span>{option.text}</span></label>})}</div></fieldset>)}
          <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm text-gray-500">{saveLabel}</span><button type="submit" disabled={!allAnswered || submitState.isLoading || saveState.isLoading} className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{submitState.isLoading ? 'Submitting…' : 'Submit assessment'}</button></div>
        </form>
      )}

      {history.data && history.data.length > 0 && <section className="rounded-xl border bg-white p-6"><h2 className="text-xl font-semibold">Attempt history</h2><div className="mt-3 divide-y">{history.data.map((item) => <div key={item.attemptId} className="flex justify-between py-3 text-sm"><span>Attempt {item.attemptNumber} · {item.status}</span><span>{item.scorePercentage == null ? 'In progress' : `${item.scorePercentage.toFixed(0)}% · ${item.passed ? 'Passed' : 'Not passed'}`}</span></div>)}</div></section>}
    </div>
  )
}
