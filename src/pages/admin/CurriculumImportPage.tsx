import { useMemo, useState } from "react";
import {
  useSubmitCurriculumImportMutation,
  useValidateCurriculumImportMutation,
} from "../../features/admin/api/adminImportApi";
import { ApiErrorNotice } from "../../features/learning-plans/components/LearnerUi";
import type {
  CurriculumImportRequest,
  CurriculumImportSummaryDto,
  CurriculumImportValidationDto,
} from "../../types/api";

export default function CurriculumImportPage() {
  const [document, setDocument] = useState('{\n  "mode": "CreateOnly"\n}'),
    [localError, setLocalError] = useState<string>(),
    [validated, setValidated] = useState<{
      text: string;
      body: CurriculumImportRequest;
      result: CurriculumImportValidationDto;
    }>(),
    [validate, vs] = useValidateCurriculumImportMutation(),
    [submit, ss] = useSubmitCurriculumImportMutation(),
    [apiError, setApiError] = useState<unknown>(),
    [summary, setSummary] = useState<CurriculumImportSummaryDto>();
  const grouped = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const issue of [
      ...(validated?.result.errors || []),
      ...(validated?.result.warnings || []),
    ])
      (out[issue.path] ??= []).push(`${issue.code}: ${issue.message}`);
    return out;
  }, [validated]);
  const run = async () => {
    setLocalError(undefined);
    setApiError(undefined);
    setValidated(undefined);
    setSummary(undefined);
    let body: CurriculumImportRequest;
    try {
      body = JSON.parse(document) as CurriculumImportRequest;
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Invalid JSON");
      return;
    }
    try {
      const result = await validate(body).unwrap();
      setValidated({ text: document, body, result });
    } catch (e) {
      setApiError(e);
    }
  };
  const importNow = async () => {
    if (!validated?.result.isValid || validated.text !== document) return;
    setApiError(undefined);
    try {
      setSummary(await submit(validated.body).unwrap());
    } catch (e) {
      setApiError(e);
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold">Curriculum Import</h1>
      <p className="mt-2 text-gray-600">
        Validate a curriculum JSON document before creating Draft content.
      </p>
      <textarea
        aria-label="Curriculum JSON"
        spellCheck={false}
        value={document}
        onChange={(e) => setDocument(e.target.value)}
        className="mt-6 min-h-[28rem] w-full rounded-xl border bg-gray-950 p-4 font-mono text-sm text-gray-100"
      />
      {localError && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-red-700">
          JSON syntax error: {localError}
        </p>
      )}
      {!!apiError && (
        <div className="mt-3">
          <ApiErrorNotice error={apiError} />
        </div>
      )}
      <div className="mt-4 flex gap-3">
        <button
          disabled={vs.isLoading || ss.isLoading}
          onClick={() => void run()}
          className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          {vs.isLoading ? "Validating…" : "Validate"}
        </button>
        <button
          disabled={
            !validated?.result.isValid ||
            validated.text !== document ||
            ss.isLoading
          }
          onClick={() => void importNow()}
          className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white disabled:opacity-40"
        >
          {ss.isLoading ? "Importing…" : "Import validated document"}
        </button>
      </div>
      {validated && (
        <section
          className={`mt-6 rounded-xl border p-5 ${validated.result.isValid ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}
        >
          <h2 className="text-xl font-semibold">
            {validated.result.isValid
              ? "Validation passed"
              : "Validation failed"}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(validated.result.counts).map(([k, v]) => (
              <span key={k} className="rounded bg-white px-2 py-1 text-sm">
                {k}: {v}
              </span>
            ))}
          </div>
          {Object.entries(grouped).map(([path, messages]) => (
            <div key={path} className="mt-4">
              <h3 className="font-semibold">{path || "Document"}</h3>
              <ul className="list-disc pl-5 text-sm">
                {messages.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
      {summary && (
        <section className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <h2 className="text-xl font-semibold">Import completed</h2>
          <pre className="mt-3 overflow-auto text-sm">
            {JSON.stringify(summary, null, 2)}
          </pre>
          <p className="mt-3 font-medium">
            Imported content is Draft and requires administrator review and
            publishing.
          </p>
        </section>
      )}
    </div>
  );
}
