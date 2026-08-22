import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import LearnerLayout from "../layouts/LearnerLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import AdminRoute from "../features/auth/components/AdminRoute";

import HomePage from "../pages/HomePage";
import CareerCatalogPage from "../pages/CareerCatalogPage";
import CareerDetailsPage from "../pages/CareerDetailsPage";
import CourseDetailsPage from "../pages/CourseDetailsPage";
import NotFoundPage from "../pages/NotFoundPage";
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const EnrollmentDetailPage = lazy(() => import('../pages/learner/EnrollmentDetailPage'))
const LearnerCoursePage = lazy(() => import('../pages/learner/LearnerCoursePage'))
const LearnerLessonPage = lazy(() => import('../pages/learner/LearnerLessonPage'))
const LearnerAssessmentPage = lazy(() => import('../pages/learner/LearnerAssessmentPage'))
const ProjectDetailsPage = lazy(() => import('../pages/ProjectDetailsPage'))
const AdminOverviewPage = lazy(() => import('../pages/admin/AdminOverviewPage'))
const AdminCatalogPages = lazy(() => import('../pages/admin/AdminCatalogPages'))
const CurriculumImportPage = lazy(() => import('../pages/admin/CurriculumImportPage'))

function deferred(page: ReactNode) {
  return <Suspense fallback={<div className="m-8 h-40 animate-pulse rounded-xl bg-gray-200" />}>{page}</Suspense>
}

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import UnauthorizedPage from "../features/auth/pages/UnauthorizedPage";

export const router = createBrowserRouter([
  // Public pages (with shared header/footer)
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/careers", element: <CareerCatalogPage /> },
      { path: "/careers/:slug", element: <CareerDetailsPage /> },
      { path: "/courses/:slug", element: <CourseDetailsPage /> },
      { path: "/courses/:courseSlug/projects/:projectId", element: deferred(<ProjectDetailsPage />) },
    ],
  },

  // Auth pages (centered card layout, no navigation)
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/unauthorized", element: <UnauthorizedPage /> },
    ],
  },

  // Learner (requires authentication)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <LearnerLayout />,
        children: [
          { path: "/dashboard", element: deferred(<DashboardPage />) },
          { path: "/learning/enrollments/:enrollmentId", element: deferred(<EnrollmentDetailPage />) },
          { path: "/learning/enrollments/:enrollmentId/courses/:courseId", element: deferred(<LearnerCoursePage />) },
          { path: "/learning/enrollments/:enrollmentId/courses/:courseId/lessons/:lessonId", element: deferred(<LearnerLessonPage />) },
          { path: "/learning/enrollments/:enrollmentId/courses/:courseId/assessments/:assessmentId", element: deferred(<LearnerAssessmentPage />) },
        ],
      },
    ],
  },

  // Admin (requires Administrator role)
  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: deferred(<AdminOverviewPage />) },
          { path: 'curriculum-import', element: deferred(<CurriculumImportPage />) },
          { path: 'import', element: deferred(<CurriculumImportPage />) },
          { path: ':resource', element: deferred(<AdminCatalogPages />) },
          { path: ':resource/:id', element: deferred(<AdminCatalogPages />) },
        ],
      },
    ],
  },

  // 404 fallback
  { path: "*", element: <NotFoundPage /> },
]);
