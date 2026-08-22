# Careersity backend integration audit

Audited against backend source at `careersity-backend` on 2026-08-09. Source priority was controllers, Application contracts/validators/services, Domain enums/rules, and tests. The backend was not modified.

## Backend API discovered

- Projects: `Careersity.Api`, `Careersity.Application`, `Careersity.Domain`, `Careersity.Infrastructure`, `Careersity.UnitTests`, and `Careersity.IntegrationTests`.
- Controllers: 24 controller classes (some share `AdminExternalLearningController.cs`) and 143 HTTP action attributes.
- Serialization: ASP.NET Core web defaults (camel-case JSON) plus `JsonStringEnumConverter`; all API enums are strings with the exact C# member casing.
- Authentication: JWT bearer access token. Claims include `sub` (user UUID), `email`, `given_name`, `family_name`, the .NET role claim, and `jti`. Roles are `Learner` and `Administrator`; admin routes require `AdministratorOnly`, learner `/api/me/**` routes require authentication but have no learner-role policy.
- Refresh: raw refresh tokens are returned in the JSON authentication result and rotated on every successful refresh. Reuse of a revoked refresh token revokes every active refresh token for that user and returns 401. Logout revokes the supplied token idempotently; revoke-all revokes all current-user tokens; password change revokes all sessions and issues a new pair. Inactive users receive the same generic 401 as bad credentials/tokens.
- Public groups: career categories; careers and primary pathways; skills; courses and lessons; public assessments/projects; learning providers/instructors; external resources and course assignments.
- Learner groups: enrollment lifecycle and history; backend-computed pathway/course/lesson progress; external-resource progress; assessment summaries, attempts, autosave, submission, and history.
- Admin groups: categories, careers, career skills, pathways/levels/courses, skills, courses/lessons/prerequisites/skills, assessments/questions/options, projects, providers/instructors/resources/course assignments, and curriculum import.

## Shared contracts

- Pagination is `{ items, page, pageSize, totalCount }`. Page numbering is one-based. Defaults are page 1 and page size 20; services clamp page below 1 to 1 and page size to 1–100. There is no `totalPages` field.
- Common list filters are `search`, type-specific enum/UUID filters, and `status` on admin endpoints. No sort parameter is implemented by controllers.
- Problems are `application/problem+json` with `{ type, title, status, detail, instance, traceId }`; FluentValidation adds `errors: Record<string,string[]>`. Validation keys are C# property paths and therefore must be matched case-insensitively by forms.
- Exception statuses: validation/argument 400, not found 404, conflict/domain lifecycle 409, authentication/unauthorized 401, catalog/database unavailable 503, unknown 500. JWT challenge is 401 and policy denial is 403.
- `X-Correlation-ID`: a client value is accepted only when 1–128 characters and matching `[A-Za-z0-9._-]+`; otherwise the backend generates one. It is returned in the response header and used as `traceId` in problems.
- Rate limiting is implemented on register (5/hour/IP), login (10/minute/IP), refresh (20/minute/IP), and both curriculum-import actions (30/minute/user-subject or IP). Rejections are 429 Problem Details. The backend does not configure a `Retry-After` response header.

## Endpoint families and access

All collection reads return 200 unless stated otherwise; creates return 201; updates and detail reads return 200; archive/publish/delete/reorder and enrollment pause/resume/withdraw return 204. Application exceptions add the relevant 400/401/404/409/503 failures; protected actions can also return 401/403 and rate-limited actions 429.

| Access | Routes |
|---|---|
| Anonymous | `POST /api/auth/register`, `/login`, `/refresh`; `GET /api/career-categories`; `GET /api/careers`, `/api/careers/{slug}`, `/api/careers/{careerId:guid}/pathway`; `GET /api/skills`, `/api/skills/{slug}`; `GET /api/courses`, `/api/courses/{slug}`, `/api/courses/{courseSlug}/lessons/{lessonSlug}`, `/api/courses/{courseSlug}/assessments`, `/projects`, `/projects/{projectId:guid}`, `/external-resources`; `GET /api/learning-providers`, `/{slug}`, `/{providerId:guid}/instructors`; `GET /api/external-learning-resources`, `/{resourceId:guid}` |
| Authenticated | `POST /api/auth/logout`, `/revoke-all`, `/change-password`; `GET|PUT /api/users/me`; every `/api/me/career-enrollments/**` route |
| Administrator | every `/api/admin/**` route |

Learner enrollment routes are rooted at `/api/me/career-enrollments`. They include collection `POST|GET`, detail `GET /{enrollmentId}`, lifecycle `POST /pause|resume|withdraw`, course `GET /courses/{courseId}` and `POST /start|complete`, lesson `GET /lessons/{lessonId}` and `POST /start|complete`, external-resource `GET` and `POST /{assignmentId}/start|complete`, and assessment list/start/history/detail/save/submit under `/assessments/{assessmentId}/attempts`.

Admin route roots are `/api/admin/career-categories`, `/careers`, `/careers/{careerId}/skills`, `/careers/{careerId}/pathways`, `/skills`, `/courses`, `/assessments`, `/projects`, `/learning-providers`, `/instructors`, `/external-learning-resources`, `/courses/{courseId}/external-resources`, and `/curriculum-imports`. Nested authoring uses UUIDs; public detail reads use slugs where the controller route says `slug` and UUIDs where constrained with `:guid`.

## Contract mismatches found

| Frontend file | Existing behavior | Backend contract | Required fix |
|---|---|---|---|
| `src/services/api.ts` | No correlation header | Backend accepts/exposes `X-Correlation-ID` | Generate a valid ID centrally for every request |
| `src/services/api.ts` | Returned heterogeneous RTK errors | Backend consistently emits Problem Details | Normalize numeric HTTP errors and retain `traceId`/validation errors |
| `src/services/api.ts` | Failed refresh cleared Redux only | Unrecoverable 401 ends the frontend session | Clear persisted refresh token and redirect protected users to login; never refresh 403; retry once |
| `src/features/admin/api/adminProvidersApi.ts` | Course-resource assignment response was typed as the request DTO | Controller returns `CourseExternalResourceDto` with 201 | Correct mutation result type |

No route mismatches were found in the existing auth, career, course, enrollment, learner assessment, admin career, admin course, provider, or curriculum-import endpoint definitions. The existing DTO field casing and enum unions match the inspected Application records and enum serialization.

## Missing frontend integrations

- Public provider list/detail, provider instructor list, and standalone external-resource list/detail had contracts but no RTK Query endpoints.
- Existing admin APIs expose the backend operations, but the current router has only an admin overview page; authoring, lifecycle, reorder, and import workflows still need UI screens.
- Learner APIs are represented in RTK Query, but the current UI exposes only enrollment listing/enrollment entry points; course/lesson/resource/assessment workflow screens remain to be built.
- There is no coordinated assessment autosave hook yet. A UI implementation must debounce or serialize calls to the existing PUT responses mutation.

## Unsafe assumptions removed or still prohibited

- Do not derive lock/completion/progress state. Use `availabilityStatus`, `progressPercentage`, `hasPassed`, and `currentCourse` from learner DTOs.
- Do not use public course DTOs for enrolled learner screens or admin assessment DTOs for learner attempts.
- Learner answer-option DTOs contain no `isCorrect`; correctness appears only in response DTOs after grading.
- Publishing/archive UI must treat 409 as authoritative. Domain/service rules make published and archived content immutable and enforce dependency readiness.
- External links must use a new tab with `noopener noreferrer`; DTOs describe source/provider but contain no Careersity ownership or endorsement claim.
- Curriculum import is validation-first, uses the same document for validation and import, is capped at 5 MiB, returns warnings/errors/counts, and creates Draft content rather than implicitly publishing it.

## Implementation order

1. Harden shared transport: correlation, normalized Problem Details, single-flight refresh, one retry, and terminal-session handling.
2. Correct response typings and add missing public external-learning API endpoints.
3. Split the currently monolithic contract file by backend bounded context without changing public imports.
4. Build learner course/lesson/resource flows using backend-computed state.
5. Build assessment UX with serialized/debounced autosave and no answer-key exposure.
6. Build admin dependency-aware authoring and lifecycle screens, always retaining 409 handling.
7. Build the validation-first curriculum import UI and invalidate affected catalog/admin tags after import.

