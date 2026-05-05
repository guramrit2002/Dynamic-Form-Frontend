import { useLocation, useParams, Link } from 'react-router-dom'

export default function SuccessPage() {
  const { id }   = useParams()
  const location = useLocation()
  const submission = location.state?.submission

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Submission Received</h1>
        <p className="mt-2 text-sm text-gray-500">Your response has been saved successfully.</p>

        {submission && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Summary</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Submission ID</span>
              <span className="font-medium text-gray-800">#{submission.id}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Form Version</span>
              <span className="font-medium text-gray-800">v{submission.version}</span>
            </div>
            {submission.data?._status && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-indigo-600 capitalize">{submission.data._status}</span>
              </div>
            )}
            {submission.data?.status && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Decision</span>
                <span className="font-medium text-green-600 capitalize">{submission.data.status}</span>
              </div>
            )}
            {submission.data?._tags?.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Tags</span>
                <span className="font-medium text-gray-800">{submission.data._tags.join(', ')}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link to={`/forms/${id}`}
            className="w-full rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition text-center">
            Submit Another Response
          </Link>
          <Link to="/"
            className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition text-center">
            Back to Forms
          </Link>
        </div>
      </div>
    </div>
  )
}
