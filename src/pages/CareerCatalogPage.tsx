import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetCareersQuery,
  useGetCareerCategoriesQuery,
} from "../features/careers/api/careersApi";
import { useDebounce } from "../hooks/useDebounce";

export default function CareerCatalogPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading, isFetching } = useGetCareersQuery({
    search: debouncedSearch || undefined,
    categoryId,
    page,
    pageSize: 20,
  });
  const { data: categories } = useGetCareerCategoriesQuery();

  const totalPages = data ? Math.ceil(data.totalCount / data.pageSize) : 0;

  return (
    <div className="catalog-page mx-auto max-w-7xl px-4 py-10">
      <header className="page-intro">
        <p className="eyebrow">The Careersity prospectus</p>
        <h1 className="text-3xl font-bold text-gray-900">Find your field of study</h1>
        <p>Explore career curricula built around practical skills, progressive coursework, and a clear destination.</p>
      </header>

      {/* Filters */}
      <div className="filter-panel mb-8 flex flex-col gap-4 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search careers…"
          className="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={categoryId ?? ""}
          onChange={(e) => {
            setCategoryId(e.target.value || undefined);
            setPage(1);
          }}
          className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          <p className="text-lg">No careers found.</p>
          {(debouncedSearch || categoryId) && (
            <button
              onClick={() => {
                setSearch("");
                setCategoryId(undefined);
                setPage(1);
              }}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity ${
            isFetching ? "opacity-60" : ""
          }`}
        >
          {data?.items.map((career) => (
            <Link
              key={career.id}
              to={`/careers/${career.slug}`}
              className="career-card rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-blue-600">
                {career.categoryName}
              </p>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {career.title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-3">
                {career.shortDescription}
              </p>
              {career.estimatedDurationWeeks && (
                <p className="mt-4 text-xs text-gray-400">
                  ~{career.estimatedDurationWeeks} weeks
                </p>
              )}
              <span className="card-arrow" aria-hidden="true">Explore pathway →</span>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border px-3 py-1 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded border px-3 py-1 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
