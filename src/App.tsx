import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { AppLayout } from './components/auth/AppLayout'
import { AuthLayout } from './components/auth/AuthLayout'
import { GuestRoute } from './components/auth/GuestRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import { AdminShell } from './components/admin/AdminShell'
import { PageLoader } from './components/ui/PageLoader'
import { ThemeProvider } from './theme/ThemeProvider'

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })))
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))
const Lessons = lazy(() => import('./pages/Lessons').then((m) => ({ default: m.Lessons })))
const MusicShowcase = lazy(() =>
  import('./pages/MusicShowcase').then((m) => ({ default: m.MusicShowcase })),
)
const Community = lazy(() => import('./pages/Community').then((m) => ({ default: m.Community })))
const Events = lazy(() => import('./pages/Events').then((m) => ({ default: m.Events })))
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })))
const SignIn = lazy(() => import('./pages/auth/SignIn').then((m) => ({ default: m.SignIn })))
const SignUp = lazy(() => import('./pages/auth/SignUp').then((m) => ({ default: m.SignUp })))
const ChooseInstruments = lazy(() =>
  import('./pages/dashboard/ChooseInstruments').then((m) => ({ default: m.ChooseInstruments })),
)
const StudentDashboard = lazy(() =>
  import('./pages/dashboard/StudentDashboard').then((m) => ({ default: m.StudentDashboard })),
)
const AdminOverview = lazy(() =>
  import('./pages/admin/AdminOverview').then((m) => ({ default: m.AdminOverview })),
)
const AdminStudents = lazy(() =>
  import('./pages/admin/AdminStudents').then((m) => ({ default: m.AdminStudents })),
)
const AdminLessons = lazy(() =>
  import('./pages/admin/AdminLessons').then((m) => ({ default: m.AdminLessons })),
)
const AdminAssignments = lazy(() =>
  import('./pages/admin/AdminAssignments').then((m) => ({ default: m.AdminAssignments })),
)
const AdminQuizzes = lazy(() =>
  import('./pages/admin/AdminQuizzes').then((m) => ({ default: m.AdminQuizzes })),
)
const AdminFinance = lazy(() =>
  import('./pages/admin/AdminFinance').then((m) => ({ default: m.AdminFinance })),
)

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<GuestRoute />}>
                <Route element={<AuthLayout />}>
                  <Route path="sign-in" element={<SignIn />} />
                  <Route path="sign-up" element={<SignUp />} />
                </Route>
              </Route>

              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="lessons" element={<Lessons />} />
                <Route path="music" element={<MusicShowcase />} />
                <Route path="community" element={<Community />} />
                <Route path="events" element={<Events />} />
                <Route path="contact" element={<Contact />} />
              </Route>

              <Route element={<ProtectedRoute requireStudent />}>
                <Route element={<AppLayout />}>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="choose-instruments" element={<ChooseInstruments />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute requireAdmin />}>
                <Route element={<AppLayout />}>
                  <Route path="admin" element={<AdminShell />}>
                    <Route index element={<AdminOverview />} />
                    <Route path="students" element={<AdminStudents />} />
                    <Route path="lessons" element={<AdminLessons />} />
                    <Route path="assignments" element={<AdminAssignments />} />
                    <Route path="quizzes" element={<AdminQuizzes />} />
                    <Route path="finance" element={<AdminFinance />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
