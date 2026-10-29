import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { RequireAuth } from '../features/auth/RequireAuth'
import { AboutPage } from '../pages/AboutPage'
import { AccountPage } from '../pages/AccountPage'
import { AuthConfirmPage } from '../pages/AuthConfirmPage'
import { CommunityPage } from '../pages/CommunityPage'
import { DiscoverPage } from '../pages/DiscoverPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { HomePage } from '../pages/HomePage'
import { JournalPage } from '../pages/JournalPage'
import { MediaDetailPage } from '../pages/MediaDetailPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { ProfilePage } from '../pages/ProfilePage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage'
import { SignInPage } from '../pages/SignInPage'
import { SignUpPage } from '../pages/SignUpPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'discover', element: <DiscoverPage /> },
      { path: 'media/:mediaType/:id', element: <MediaDetailPage /> },
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'journal',
            element: <JournalPage />,
          },
          {
            path: 'community',
            element: <CommunityPage />,
          },
          { path: 'account', element: <AccountPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'onboarding', element: <OnboardingPage /> },
        ],
      },
      { path: 'signin', element: <SignInPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'auth/confirm', element: <AuthConfirmPage /> },
      { path: 'confirm', element: <AuthConfirmPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
