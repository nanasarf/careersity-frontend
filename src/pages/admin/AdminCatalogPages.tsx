import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  useAdminCatalogItemQuery,
  useAdminCatalogQuery,
  useAdminCatalogStatusMutation,
  useAdminCreateCatalogItemMutation,
  useAdminUpdateCatalogItemMutation,
  type AdminRow,
} from "../../features/admin/api/adminCrudApi";
import { ApiErrorNotice } from "../../features/learning-plans/components/LearnerUi";
import type { ContentStatus } from "../../types/api";
import { CourseAuthoring } from "../../features/admin/components/CourseAuthoring";
import { CareerAuthoring } from "../../features/admin/components/CareerAuthoring";
import { AssessmentAuthoring } from "../../features/admin/components/AssessmentAuthoring";
import { useAdminChangeCareerCategoryMutation } from "../../features/admin/api/adminCareersApi";
import { FieldError } from "../../features/admin/components/AdminAuthoring";
import { problemFrom, useDebounced } from "../../features/admin/components/adminAuthoringUtils";

type Field = {
  name: string;
  label: string;
  kind?: "textarea" | "number" | "select" | "checkbox" | "url";
  options?: string[];
  required?: boolean;
};
const statuses = ["Draft", "Published", "Archived"];
const schemas: Record<
  string,
  { title: string; fields: Field[]; columns: string[] }
> = {
  skills: {
    title: "Skills",
    columns: ["name", "category"],
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "description", label: "Description", kind: "textarea" },
      {
        name: "category",
        label: "Category",
        kind: "select",
        options: [
          "Technical",
          "Analytical",
          "Communication",
          "Professional",
          "DomainKnowledge",
          "Tool",
        ],
        required: true,
      },
    ],
  },
  providers: {
    title: "Learning Providers",
    columns: ["name", "websiteUrl"],
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "websiteUrl", label: "Website URL", kind: "url" },
      { name: "logoUrl", label: "Logo URL", kind: "url" },
    ],
  },
  instructors: {
    title: "Instructors",
    columns: ["name", "providerName", "title"],
    fields: [
      { name: "learningProviderId", label: "Learning provider", required: true },
      { name: "name", label: "Name", required: true },
      { name: "title", label: "Title" },
      { name: "biography", label: "Biography", kind: "textarea" },
      { name: "profileUrl", label: "Profile URL", kind: "url" },
    ],
  },
  "external-resources": {
    title: "External Resources",
    columns: ["title", "providerName", "resourceType", "accessType"],
    fields: [
      { name: "learningProviderId", label: "Learning provider", required: true },
      { name: "instructorId", label: "Instructor (optional)" },
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", kind: "textarea" },
      {
        name: "resourceType",
        label: "Resource type",
        kind: "select",
        options: [
          "LectureVideo",
          "VideoPlaylist",
          "Reading",
          "Exercise",
          "ExternalAssessment",
          "Assignment",
          "AnswerGuide",
          "CourseWebsite",
          "CertificateOpportunity",
          "Dataset",
          "SoftwareTool",
          "Other",
        ],
        required: true,
      },
      {
        name: "accessType",
        label: "Access type",
        kind: "select",
        options: [
          "Free",
          "FreeWithAccount",
          "AuditFree",
          "Paid",
          "InstitutionRestricted",
          "Unknown",
        ],
        required: true,
      },
      { name: "url", label: "URL", kind: "url", required: true },
      { name: "sourceLabel", label: "Source label" },
      {
        name: "estimatedDurationMinutes",
        label: "Duration (minutes)",
        kind: "number",
      },
    ],
  },
  courses: {
    title: "Courses",
    columns: ["title", "difficulty", "estimatedDurationMinutes"],
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "slug", label: "Slug", required: true },
      {
        name: "shortDescription",
        label: "Short description",
        kind: "textarea",
        required: true,
      },
      {
        name: "detailedDescription",
        label: "Detailed description",
        kind: "textarea",
      },
      {
        name: "difficulty",
        label: "Difficulty",
        kind: "select",
        options: ["Foundation", "Beginner", "Intermediate", "Advanced"],
        required: true,
      },
      {
        name: "estimatedDurationMinutes",
        label: "Duration (minutes)",
        kind: "number",
        required: true,
      },
    ],
  },
  "career-categories": {
    title: "Career Categories",
    columns: ["name", "slug"],
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "description", label: "Description", kind: "textarea" },
    ],
  },
  careers: {
    title: "Careers",
    columns: ["title", "categoryName", "estimatedDurationWeeks"],
    fields: [
      { name: "careerCategoryId", label: "Category", required: true },
      { name: "title", label: "Title", required: true },
      { name: "slug", label: "Slug", required: true },
      {
        name: "shortDescription",
        label: "Short description",
        kind: "textarea",
        required: true,
      },
      {
        name: "detailedDescription",
        label: "Detailed description",
        kind: "textarea",
      },
      { name: "responsibilities", label: "Responsibilities", kind: "textarea" },
      {
        name: "estimatedDurationWeeks",
        label: "Duration (weeks)",
        kind: "number",
      },
    ],
  },
  assessments: {
    title: "Assessments",
    columns: ["title", "courseTitle", "questionCount"],
    fields: [
      { name: "courseId", label: "Course", required: true },
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", kind: "textarea" },
      {
        name: "passingScorePercentage",
        label: "Passing score %",
        kind: "number",
        required: true,
      },
      { name: "maximumAttempts", label: "Maximum attempts", kind: "number" },
    ],
  },
  projects: {
    title: "Projects",
    columns: ["title", "courseTitle", "submissionType"],
    fields: [
      { name: "courseId", label: "Course", required: true },
      { name: "title", label: "Title", required: true },
      {
        name: "description",
        label: "Description",
        kind: "textarea",
        required: true,
      },
      {
        name: "instructions",
        label: "Instructions",
        kind: "textarea",
        required: true,
      },
      { name: "expectedOutput", label: "Expected output", kind: "textarea" },
      {
        name: "evaluationCriteria",
        label: "Evaluation criteria",
        kind: "textarea",
      },
      {
        name: "submissionType",
        label: "Submission type",
        kind: "select",
        options: [
          "RepositoryUrl",
          "PortfolioUrl",
          "DocumentUrl",
          "VideoUrl",
          "TextResponse",
          "Mixed",
        ],
        required: true,
      },
      {
        name: "estimatedDurationMinutes",
        label: "Duration (minutes)",
        kind: "number",
        required: true,
      },
    ],
  },
};

function display(value: unknown) {
  return value === null || value === undefined ? "—" : String(value);
}
function Status({ value }: { value: unknown }) {
  const s = String(value);
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s === "Published" ? "bg-emerald-100 text-emerald-700" : s === "Archived" ? "bg-gray-200 text-gray-600" : "bg-amber-100 text-amber-800"}`}
    >
      {s}
    </span>
  );
}

const relationshipResources: Record<string, string> = {
  skillId: "skills", courseId: "courses", prerequisiteCourseId: "courses",
  learningProviderId: "providers", instructorId: "instructors", careerCategoryId: "career-categories",
  externalLearningResourceId: "external-resources",
};
function RelationshipField({ field, initial, disabled, error, onEdit }: { field: Field; initial: unknown; disabled: boolean; error: unknown; onEdit: () => void }) {
  const [search, setSearch] = useState(""), [page, setPage] = useState(1), debounced = useDebounced(search);
  const resource = relationshipResources[field.name];
  const query = useAdminCatalogQuery({ resource, page, pageSize: 20, search: debounced || undefined }, { skip: !resource });
  useEffect(() => setPage(1), [debounced]);
  const label = (row: AdminRow) => String(row.name ?? row.title ?? row.providerName ?? row.id);
  return <>
    <input value={search} onChange={e => setSearch(e.target.value)} disabled={disabled} placeholder={`Search ${field.label.replace(/ ID.*$/, "").toLowerCase()}…`} className="mt-1 w-full rounded-lg border px-3 py-2" />
    <select name={field.name} required={field.required} disabled={disabled || query.isFetching} defaultValue={String(initial ?? "")} onChange={onEdit} className="mt-2 w-full rounded-lg border px-3 py-2">
      <option value="">{query.isFetching ? "Loading…" : "Select…"}</option>
      {!!initial && !query.data?.items.some(row => row.id === initial) && <option value={String(initial)}>Current selection</option>}
      {query.data?.items.map(row => <option key={row.id} value={row.id}>{label(row)}{row.providerName ? ` — ${row.providerName}` : ""}</option>)}
    </select>
    {!query.isFetching && query.data?.items.length === 0 && <p className="mt-1 text-xs text-gray-600">No matching choices.</p>}
    {!!query.data && query.data.totalCount > query.data.pageSize && <div className="mt-2 flex items-center gap-2 text-xs"><button type="button" disabled={page === 1 || query.isFetching} onClick={() => setPage(value => value - 1)} className="rounded border px-2 py-1 disabled:opacity-40">Previous choices</button><span>Page {page}</span><button type="button" disabled={page * query.data.pageSize >= query.data.totalCount || query.isFetching} onClick={() => setPage(value => value + 1)} className="rounded border px-2 py-1 disabled:opacity-40">More choices</button></div>}
    {field.name === "careerCategoryId" && <p className="mt-2 text-xs"><Link to="/admin/career-categories/new" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700">Create career category in a new tab ↗</Link><span className="ml-2 text-gray-600">Then search here to select it.</span></p>}
    {!!query.error && <p className="mt-1 text-xs text-red-700">Could not load choices.</p>}
    <FieldError error={error} field={field.name}/>
  </>;
}

function Editor({ resource, id }: { resource: string; id?: string }) {
  const schema = schemas[resource],
    navigate = useNavigate();
  const [contextParams] = useSearchParams();
  const { data, error, isLoading, refetch } = useAdminCatalogItemQuery(
    { resource, id: id! },
    { skip: !id },
  );
  const [create, createState] = useAdminCreateCatalogItemMutation(),
    [update, updateState] = useAdminUpdateCatalogItemMutation();
  const [changeCareerCategory, categoryState] = useAdminChangeCareerCategoryMutation();
  const [changeStatus, statusState] = useAdminCatalogStatusMutation();
  const [saveError, setSaveError] = useState<unknown>();
  const lifecycle = async (action: "publish" | "archive" | "mark-reviewed") => { if (!id || !confirm(action === "publish" ? "Publish this content now? Dependencies must already be published." : action === "archive" ? "Archive this content? It may remain visible in learner history." : "Mark this external resource as reviewed?")) return; setSaveError(undefined); try { await changeStatus({ resource, id, action }).unwrap(); await refetch() } catch (caught) { setSaveError(caught) } };
  if (id && isLoading)
    return <div className="h-40 animate-pulse rounded-xl bg-gray-200" />;
  if (id && !data) return <ApiErrorNotice error={error} />;
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveError(undefined);
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    schema.fields.forEach((f) => {
      let v: unknown = fd.get(f.name);
      if (f.kind === "number") v = v === "" ? null : Number(v);
      else if (f.kind === "checkbox") v = fd.has(f.name);
      else if (v === "") v = null;
      body[f.name] = v;
    });
    const changedCareerCategoryId = resource === "careers" ? body.careerCategoryId : undefined;
    if (
      id &&
      (resource === "careers" ||
        resource === "assessments" ||
        resource === "projects")
    )
      delete body[resource === "careers" ? "careerCategoryId" : "courseId"];
    try {
      if (id) {
        await update({ resource, id, body }).unwrap();
        if (resource === "careers" && typeof changedCareerCategoryId === "string") await changeCareerCategory({ id, careerCategoryId: changedCareerCategoryId }).unwrap();
      }
      else {
        const created = await create({ resource, body }).unwrap();
        const returnTo = contextParams.get("returnTo");
        navigate(returnTo || ((resource === "careers" || resource === "courses")
          ? `/admin/${resource}/${created.id}`
          : `/admin/${resource}`));
        return;
      }
      navigate(contextParams.get("returnTo") || `/admin/${resource}`);
    } catch (e) {
      setSaveError(e);
    }
  };
  const initial = data as Record<string, unknown> | undefined;
  return (
    <div>
      <Link to={contextParams.get("returnTo") || `/admin/${resource}`} className="text-sm text-blue-600">
        ← {contextParams.get("returnTo") ? "Back to curriculum" : schema.title}
      </Link>
      <h1 className="mt-3 text-3xl font-bold">
        {id ? "Edit" : "Create"} {schema.title.replace(/s$/, "")}
      </h1>
      {id && data && <div className="mt-4 flex flex-wrap items-center gap-3"><Status value={data.status}/>{resource === "external-resources" && data.status !== "Archived" && <button type="button" disabled={statusState.isLoading} onClick={() => void lifecycle("mark-reviewed")} className="rounded border border-violet-600 px-4 py-2 font-semibold text-violet-700 disabled:opacity-50">Mark reviewed</button>}{data.status === "Draft" && <button type="button" disabled={statusState.isLoading} onClick={() => void lifecycle("publish")} className="rounded bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-50">Publish</button>}{data.status !== "Archived" && <button type="button" disabled={statusState.isLoading} onClick={() => void lifecycle("archive")} className="rounded border border-red-600 px-4 py-2 font-semibold text-red-700 disabled:opacity-50">Archive</button>}{data.status === "Published" && typeof data.slug === "string" && (resource === "careers" || resource === "courses") && <Link to={`/${resource}/${data.slug}`} target="_blank" rel="noopener noreferrer" className="rounded border border-blue-600 px-4 py-2 font-semibold text-blue-700">View public page ↗</Link>}<span className="text-sm text-gray-600">Publish dependencies first; backend validation remains authoritative.</span></div>}
      {data?.status && data.status !== "Draft" && (
        <p className="mt-4 rounded-lg bg-gray-100 p-4 text-sm">
          {data.status} content is read-only. Create and relationship editing is available only while content is Draft.
        </p>
      )}
      <form
        onSubmit={submit}
        className="mt-6 space-y-5 rounded-xl border bg-white p-6"
      >
        {schema.fields.map((f) => (
          <label key={f.name} className="block text-sm font-medium">
            {f.label}
            {relationshipResources[f.name] ? (
              <RelationshipField field={f} initial={initial?.[f.name] ?? (f.name === "careerCategoryId" ? (initial?.careerCategory as Record<string, unknown> | undefined)?.id : undefined) ?? contextParams.get(f.name)} disabled={data?.status !== undefined && data.status !== "Draft"} error={saveError} onEdit={() => saveError && setSaveError(undefined)} />
            ) : f.kind === "textarea" ? (
              <><textarea
                name={f.name}
                required={f.required}
                disabled={data?.status !== undefined && data.status !== "Draft"}
                onChange={() => saveError && setSaveError(undefined)}
                defaultValue={
                  display(initial?.[f.name]) === "—"
                    ? ""
                    : display(initial?.[f.name])
                }
                className="mt-1 min-h-24 w-full rounded-lg border px-3 py-2"
              />
              <FieldError error={saveError} field={f.name} />
              </>
            ) : f.kind === "select" ? (
              <><select
                name={f.name}
                required={f.required}
                disabled={data?.status !== undefined && data.status !== "Draft"}
                onChange={() => saveError && setSaveError(undefined)}
                defaultValue={
                  display(initial?.[f.name]) === "—"
                    ? ""
                    : display(initial?.[f.name])
                }
                className="mt-1 w-full rounded-lg border px-3 py-2"
              >
                <option value="">Select…</option>
                {f.options?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <FieldError error={saveError} field={f.name} />
              </>
            ) : (
              <><input
                name={f.name}
                type={
                  f.kind === "number"
                    ? "number"
                    : f.kind === "url"
                      ? "url"
                      : "text"
                }
                required={f.required}
                disabled={data?.status !== undefined && data.status !== "Draft"}
                onChange={() => saveError && setSaveError(undefined)}
                defaultValue={
                  display(initial?.[f.name]) === "—"
                    ? ""
                    : display(initial?.[f.name])
                }
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
              <FieldError error={saveError} field={f.name} />
              </>
            )}
          </label>
        ))}
        {!!saveError && <><ApiErrorNotice error={saveError} />{problemFrom(saveError)?.errors && <ul className="text-sm text-red-700">{Object.entries(problemFrom(saveError)!.errors!).filter(([key]) => !schema.fields.some(f => key.toLowerCase().endsWith(f.name.toLowerCase()))).flatMap(([key,messages]) => messages.map(message => <li key={`${key}-${message}`}>{key}: {message}</li>))}</ul>}</>}
        <button
          disabled={
            createState.isLoading ||
            updateState.isLoading ||
            categoryState.isLoading ||
            (data?.status !== undefined && data.status !== "Draft")
          }
          className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          {createState.isLoading || updateState.isLoading ? "Saving…" : "Save"}
        </button>
      </form>
      {id && data && resource === "courses" && <CourseAuthoring courseId={id} status={data.status} />}
      {id && data && resource === "careers" && <CareerAuthoring careerId={id} status={data.status} />}
      {id && data && resource === "assessments" && <AssessmentAuthoring assessmentId={id} status={data.status} />}
    </div>
  );
}

export default function AdminCatalogPages() {
  const { resource = "", id } = useParams(),
    schema = schemas[resource];
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") || 1),
    search = params.get("search") || "",
    status = (params.get("status") || undefined) as ContentStatus | undefined;
  const category = params.get("category") || undefined,
    categoryId = params.get("categoryId") || undefined,
    difficulty = params.get("difficulty") || undefined,
    courseId = params.get("courseId") || undefined,
    skillId = params.get("skillId") || undefined,
    submissionType = params.get("submissionType") || undefined;
  const query = useMemo(
    () => ({
      resource,
      page,
      pageSize: 20,
      search: search || undefined,
      status,
      category,
      categoryId,
      difficulty,
      courseId,
      skillId,
      submissionType,
    }),
    [resource, page, search, status, category, categoryId, difficulty, courseId, skillId, submissionType],
  );
  const { data, error, isLoading } = useAdminCatalogQuery(query, {
    skip: !schema,
  });
  const [act, actState] = useAdminCatalogStatusMutation();
  const skillChoices = useAdminCatalogQuery({resource:"skills",page:1,pageSize:20,search:undefined},{skip:resource!=="courses"});
  const courseChoices = useAdminCatalogQuery({resource:"courses",page:1,pageSize:20,search:undefined},{skip:resource!=="assessments"&&resource!=="projects"});
  const categoryChoices = useAdminCatalogQuery({resource:"career-categories",page:1,pageSize:50,search:undefined},{skip:resource!=="careers"});
  const [actionError, setActionError] = useState<unknown>();
  if (!schema) return <p>Unknown admin section.</p>;
  if (id === "new" || id)
    return <Editor resource={resource} id={id === "new" ? undefined : id} />;
  const change = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    setParams(next);
  };
  const action = async (
    row: AdminRow,
    kind: "publish" | "archive" | "mark-reviewed",
  ) => {
    if (
      (kind === "publish" || kind === "archive") &&
      !window.confirm(
        `${kind === "publish" ? "Publish" : "Archive"} this item?`,
      )
    )
      return;
    setActionError(undefined);
    try {
      await act({ resource, id: row.id, action: kind }).unwrap();
    } catch (e) {
      setActionError(e);
    }
  };
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{schema.title}</h1>
          <p className="mt-1 text-gray-600">
            Create, review, publish, and archive curriculum content.
          </p>
        </div>
        <Link
          to={`/admin/${resource}/new`}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
        >
          Create {schema.title.replace(/s$/, "")}
        </Link>
      </div>
      <div className="mt-6 flex flex-wrap gap-3 rounded-xl border bg-white p-4">
        <input
          aria-label="Search"
          value={search}
          onChange={(e) => change("search", e.target.value)}
          placeholder="Search…"
          className="min-w-64 rounded-lg border px-3 py-2"
        />
        <select
          aria-label="Status"
          value={status || ""}
          onChange={(e) => change("status", e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {resource === "skills" && <select aria-label="Category" value={category || ""} onChange={e=>change("category",e.target.value)} className="rounded-lg border px-3 py-2"><option value="">All categories</option>{["Technical","Analytical","Communication","Professional","DomainKnowledge","Tool"].map(x=><option key={x}>{x}</option>)}</select>}
        {resource === "courses" && <><select aria-label="Difficulty" value={difficulty || ""} onChange={e=>change("difficulty",e.target.value)} className="rounded-lg border px-3 py-2"><option value="">All difficulties</option>{["Foundation","Beginner","Intermediate","Advanced"].map(x=><option key={x}>{x}</option>)}</select><select aria-label="Skill" value={skillId||""} onChange={e=>change("skillId",e.target.value)} className="rounded-lg border px-3 py-2"><option value="">All skills</option>{skillChoices.data?.items.map(x=><option key={x.id} value={x.id}>{display(x.name)}</option>)}</select></>}
        {resource === "careers" && <select aria-label="Career category" value={categoryId||""} onChange={e=>change("categoryId",e.target.value)} className="rounded-lg border px-3 py-2"><option value="">All categories</option>{categoryChoices.data?.items.map(x=><option key={x.id} value={x.id}>{display(x.name)}</option>)}</select>}
        {(resource === "assessments" || resource === "projects") && <select aria-label="Course" value={courseId||""} onChange={e=>change("courseId",e.target.value)} className="rounded-lg border px-3 py-2"><option value="">All courses</option>{courseChoices.data?.items.map(x=><option key={x.id} value={x.id}>{display(x.title)}</option>)}</select>}
        {resource === "projects" && <select aria-label="Submission type" value={submissionType||""} onChange={e=>change("submissionType",e.target.value)} className="rounded-lg border px-3 py-2"><option value="">All submission types</option>{["RepositoryUrl","PortfolioUrl","DocumentUrl","VideoUrl","TextResponse","Mixed"].map(x=><option key={x}>{x}</option>)}</select>}
      </div>
      {!!actionError && (
        <div className="mt-4">
          <ApiErrorNotice error={actionError} />
        </div>
      )}
      {isLoading ? (
        <div className="mt-5 h-48 animate-pulse rounded-xl bg-gray-200" />
      ) : error ? (
        <div className="mt-5">
          <ApiErrorNotice error={error} />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                {schema.columns.map((c) => (
                  <th key={c} className="px-4 py-3">
                    {c.replace(/([A-Z])/g, " $1")}
                  </th>
                ))}
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((row) => (
                <tr key={row.id} className="border-t">
                  {schema.columns.map((c) => (
                    <td key={c} className="px-4 py-3">
                      {display(row[c])}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <Status value={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/admin/${resource}/${row.id}`}
                        className="text-blue-600"
                      >
                        {row.status === "Archived" ? "View" : "Edit"}
                      </Link>
                      {row.status === "Draft" && (
                        <button
                          disabled={actState.isLoading}
                          onClick={() => void action(row, "publish")}
                          className="text-emerald-700"
                        >
                          Publish
                        </button>
                      )}
                      {row.status !== "Archived" && (
                        <button
                          disabled={actState.isLoading}
                          onClick={() => void action(row, "archive")}
                          className="text-red-700"
                        >
                          Archive
                        </button>
                      )}
                      {resource === "external-resources" &&
                        row.status !== "Archived" && (
                          <button
                            disabled={actState.isLoading}
                            onClick={() => void action(row, "mark-reviewed")}
                            className="text-violet-700"
                          >
                            Mark reviewed
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex items-center justify-between text-sm">
        <span>{data?.totalCount ?? 0} items</span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => change("page", String(page - 1))}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-2 py-1">Page {page}</span>
          <button
            disabled={!data || page * data.pageSize >= data.totalCount}
            onClick={() => change("page", String(page + 1))}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
