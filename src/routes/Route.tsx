import { BrowserRouter, Route, Routes } from "react-router-dom";

import UnauthLayout from "../layouts/UnauthLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

import { publicRoutes } from "./routes";

// Profile
import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";
import AccountSecurity from "../pages/profile/AccountSecurity";
import AppSettings from "../pages/profile/AppSettings";
import PrivacyTerms from "../pages/profile/PrivacyTerms";

// Period Tracker
import PeriodDashboard from "../pages/period/PeriodDashboard";
import CycleSetup from "../pages/period/CycleSetup";
import FlowTracker from "../pages/period/FlowTracker";
import SymptomsTracker from "../pages/period/SymptomsTracker";
import MedicationTracker from "../pages/period/MedicationTracker";
import NutritionTracker from "../pages/period/NutritionTracker";
import WellnessTracker from "../pages/period/WellnessTracker";
import PeriodNotes from "../pages/period/PeriodNotes";
import ReportsInsights from "../pages/period/ReportsInsights";
import PartnerSharing from "../pages/period/PartnerSharing";

// Pregnancy Tracker
import PregnancyDashboard from "../pages/pregnancy/PregnancyDashboard";
import PregnancySetup from "../pages/pregnancy/PregnancySetup";
import BabyDevelopment from "../pages/pregnancy/BabyDevelopment";
import BabyMovement from "../pages/pregnancy/BabyMovement";
import ContractionTimer from "../pages/pregnancy/ContractionTimer";
import HospitalBirthPlanning from "../pages/pregnancy/HospitalBirthPlanning";
import PostpartumTransition from "../pages/pregnancy/PostpartumTransition";
import PregnancyEducation from "../pages/pregnancy/PregnancyEducation";
import PregnancySymptoms from "../pages/pregnancy/PregnancySymptoms";
import PregnancyNutrition from "../pages/pregnancy/PregnancyNutrition";
import PregnancyWellness from "../pages/pregnancy/PregnancyWellness";
import PregnancyNotes from "../pages/pregnancy/PregnancyNotes";
import PregnancyTimeline from "../pages/pregnancy/PregnancyTimeline";
import PregnancyAppointments from "../pages/pregnancy/PregnancyAppointments";

// Health Library
import HealthLibrary from "../pages/health/HealthLibrary";
import HealthCategories from "../pages/health/HealthCategories";
import HealthSearch from "../pages/health/HealthSearch";
import HealthArticles from "../pages/health/HealthArticles";
import HealthArticleDetails from "../pages/health/HealthArticleDetails";
import HealthSaved from "../pages/health/HealthSaved";

// Healthcare Professionals
import FindProfessional from "../pages/professionals/FindProfessional";
import ProfessionalProfile from "../pages/professionals/ProfessionalProfile";
import ConsultationChat from "../pages/professionals/ConsultationChat";
import DoctorAppointments from "../pages/professionals/DoctorAppointments";

// Emergency Assistance
import EmergencyHome from "../pages/emergency/EmergencyHome";
import EmergencyContacts from "../pages/emergency/EmergencyContacts";
import FindHealthcareFacility from "../pages/emergency/FindHealthcareFacility";
import EmergencyServices from "../pages/emergency/EmergencyServices";
import EmergencyInformation from "../pages/emergency/EmergencyInformation";

// Community
import CommunityHome from "../pages/community/CommunityHome";
import CommunityPosts from "../pages/community/CommunityPosts";
import CommunityComments from "../pages/community/CommunityComments";
import ProfessionalHealthContent from "../pages/community/ProfessionalHealthContent";
import VerifiedProof from "../pages/community/VerifiedProof";
import UserProfile from "../pages/community/UserProfile";

// Appointments
import Appointments from "../pages/appointments/Appointments";
import BookAppointment from "../pages/appointments/BookAppointment";
import AppointmentDetails from "../pages/appointments/AppointmentDetails";
import MyAppointments from "../pages/appointments/MyAppointments";
import AppointmentHistory from "../pages/appointments/AppointmentHistory";
import RescheduleAppointment from "../pages/appointments/RescheduleAppointment";
import CancelAppointment from "../pages/appointments/CancelAppointment";

// Notifications & Reminders
import Notifications from "../pages/notifications/Notifications";
import CreateReminder from "../pages/notifications/CreateReminder";
import ReminderList from "../pages/notifications/ReminderList";
import EditReminder from "../pages/notifications/EditReminder";
import NotificationSettings from "../pages/notifications/NotificationSettings";

// Premium
import Premium from "../pages/premium/Premium";
import PremiumPlans from "../pages/premium/PremiumPlans";
import PremiumCheckout from "../pages/premium/PremiumCheckout";
import PremiumFeatures from "../pages/premium/PremiumFeatures";
import PremiumStatus from "../pages/premium/PremiumStatus";
import PaymentCallback from "../pages/premium/PaymentCallback";

// Admin
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminAppointments from "../pages/admin/AdminAppointments";
import AdminArticles from "../pages/admin/AdminArticles";
import AdminProfessionals from "../pages/admin/AdminProfessionals";
import AdminMessages from "../pages/admin/AdminMessages";
import AdminPayments from "../pages/admin/AdminPayments";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}
        <Route element={<UnauthLayout />}>
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* =========================
            PROTECTED ROUTES
        ========================= */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthLayout />}>

            {/* PROFILE */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/security" element={<AccountSecurity />} />
            <Route path="/profile/settings" element={<AppSettings />} />
            <Route path="/profile/privacy" element={<PrivacyTerms />} />

            {/* PERIOD TRACKER */}
            <Route path="/period-tracker" element={<PeriodDashboard />} />
            <Route path="/period-tracker/setup" element={<CycleSetup />} />
            <Route path="/period-tracker/flow" element={<FlowTracker />} />
            <Route path="/period-tracker/symptoms" element={<SymptomsTracker />} />
            <Route path="/period-tracker/medication" element={<MedicationTracker />} />
            <Route path="/period-tracker/nutrition" element={<NutritionTracker />} />
            <Route path="/period-tracker/wellness" element={<WellnessTracker />} />
            <Route path="/period-tracker/notes" element={<PeriodNotes />} />
            <Route path="/period-tracker/reports" element={<ReportsInsights />} />
            <Route path="/period-tracker/partner-sharing" element={<PartnerSharing />} />

            {/* PREGNANCY TRACKER */}
            <Route path="/pregnancy-tracker" element={<PregnancyDashboard />} />
            <Route path="/pregnancy-tracker/setup" element={<PregnancySetup />} />
            <Route path="/pregnancy-tracker/baby-development" element={<BabyDevelopment />} />
            <Route path="/pregnancy-tracker/baby-movement" element={<BabyMovement />} />
            <Route path="/pregnancy-tracker/contraction-timer" element={<ContractionTimer />} />
            <Route path="/pregnancy-tracker/hospital-birth-planning" element={<HospitalBirthPlanning />} />
            <Route path="/pregnancy-tracker/postpartum-transition" element={<PostpartumTransition />} />
            <Route path="/pregnancy-tracker/education" element={<PregnancyEducation />} />
            <Route path="/pregnancy-tracker/symptoms" element={<PregnancySymptoms />} />
            <Route path="/pregnancy-tracker/nutrition" element={<PregnancyNutrition />} />
            <Route path="/pregnancy-tracker/wellness" element={<PregnancyWellness />} />
            <Route path="/pregnancy-tracker/notes" element={<PregnancyNotes />} />
            <Route path="/pregnancy-tracker/timeline" element={<PregnancyTimeline />} />
            <Route path="/pregnancy-tracker/appointments" element={<PregnancyAppointments />} />

            {/* HEALTH LIBRARY */}
            <Route path="/health-library" element={<HealthLibrary />} />
            <Route path="/health-library/categories" element={<HealthCategories />} />
            <Route path="/health-library/search" element={<HealthSearch />} />
            <Route path="/health-library/articles" element={<HealthArticles />} />
            {/* Supports both article URL formats */}
            <Route path="/health-library/articles/:id" element={<HealthArticleDetails />} />
            <Route path="/health-library/article/:id" element={<HealthArticleDetails />} />
            <Route path="/health-library/saved" element={<HealthSaved />} />

            {/* HEALTHCARE PROFESSIONALS */}
            <Route path="/healthcare-professionals" element={<FindProfessional />} />
            <Route path="/professionals" element={<FindProfessional />} /> {/* short alias */}
            <Route path="/healthcare-professionals/:id" element={<ProfessionalProfile />} />
            <Route path="/healthcare-professionals/:id/chat" element={<ConsultationChat />} />

            {/* DOCTOR — the page checks the role itself */}
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />

            {/* EMERGENCY ASSISTANCE */}
            <Route path="/emergency" element={<EmergencyHome />} />
            <Route path="/emergency/contacts" element={<EmergencyContacts />} />
            <Route path="/emergency/facilities" element={<FindHealthcareFacility />} />
            <Route path="/emergency/services" element={<EmergencyServices />} />
            <Route path="/emergency/information" element={<EmergencyInformation />} />

            {/* COMMUNITY */}
            <Route path="/community" element={<CommunityHome />} />
            <Route path="/community/posts" element={<CommunityPosts />} />
            <Route path="/community/comments" element={<CommunityComments />} />
            <Route path="/community/professional-content" element={<ProfessionalHealthContent />} />
            <Route path="/community/verified" element={<VerifiedProof />} />
            <Route path="/community/profile" element={<UserProfile />} />

            {/* APPOINTMENTS — fixed paths are matched before /:id automatically */}
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointments/book" element={<BookAppointment />} />
            <Route path="/appointments/my-appointments" element={<MyAppointments />} />
            <Route path="/appointments/history" element={<AppointmentHistory />} />
            <Route path="/appointments/:id" element={<AppointmentDetails />} />
            <Route path="/appointments/:id/reschedule" element={<RescheduleAppointment />} />
            <Route path="/appointments/:id/cancel" element={<CancelAppointment />} />

            {/* NOTIFICATIONS & REMINDERS */}
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/notifications/create" element={<CreateReminder />} />
            <Route path="/notifications/reminders" element={<ReminderList />} />
            <Route path="/notifications/reminders/:id/edit" element={<EditReminder />} />
            <Route path="/notifications/settings" element={<NotificationSettings />} />

            {/* PREMIUM */}
            <Route path="/premium" element={<Premium />} />
            <Route path="/premium/plans" element={<PremiumPlans />} />
            <Route path="/premium/checkout" element={<PremiumCheckout />} />
            <Route path="/premium/features" element={<PremiumFeatures />} />
            <Route path="/premium/status" element={<PremiumStatus />} />

            {/* PAYMENT CALLBACK */}
            <Route path="/payment/callback" element={<PaymentCallback />} />

            {/* ADMIN — the panel checks the role itself and blocks non-admins */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="professionals" element={<AdminProfessionals />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="payments" element={<AdminPayments />} />
            </Route>

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;