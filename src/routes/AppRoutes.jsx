import { Routes, Route } from 'react-router-dom';
import MainLayout from '../pages/layouts/MainLayout';

// Import pages
import Home from '../pages/Home';
import About from '../pages/About';
import Initiative from '../pages/Initiative';
import NgoInitiative from '../pages/NgoInitiative';
import CboInitiative from '../pages/CboInitiative';
import Consultation from '../pages/Consultation';
import Policies from '../pages/Policies';
import ProjectProtection from '../pages/ProjectProtection';
import Products from '../pages/Products';
import GalleryImages from '../pages/GalleryImages';
import GalleryVideos from '../pages/GalleryVideos';
import GalleryNews from '../pages/GalleryNews';
import Donation from '../pages/Donation';
import Contact from '../pages/Contact';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';

// Cow Rescue Pages
import CowRescueHome from '../pages/CowRescue/CowRescueHome';
import ReportIncident from '../pages/CowRescue/ReportIncident';
import TrackRescue from '../pages/CowRescue/TrackRescue';
import AlertResponse from '../pages/CowRescue/AlertResponse';
import NgoBankDetails from '../pages/Ngo/NgoBankDetails';

// Import Legal Policy Pages
import PrivacyPolicy from '../pages/Legal/PrivacyPolicy';
import TermsConditions from '../pages/Legal/TermsConditions';
import RefundCancellationPolicy from '../pages/Legal/RefundCancellationPolicy';
import DonationFundFlowPolicy from '../pages/Legal/DonationFundFlowPolicy';
import ShippingDeliveryPolicy from '../pages/Legal/ShippingDeliveryPolicy';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/about" element={<MainLayout><About /></MainLayout>} />
      <Route path="/initiative" element={<MainLayout><Initiative /></MainLayout>} />
      <Route path="/initiative/government" element={<MainLayout><Initiative /></MainLayout>} />
      <Route path="/initiative/ngo" element={<MainLayout><NgoInitiative /></MainLayout>} />
      <Route path="/initiative/cbo" element={<MainLayout><CboInitiative /></MainLayout>} />
      <Route path="/consultation" element={<MainLayout><Policies /></MainLayout>} />
      <Route path="/consultation/policies" element={<MainLayout><Policies /></MainLayout>} />
      <Route path="/consultation/project-protection" element={<MainLayout><ProjectProtection /></MainLayout>} />
      <Route path="/consultation/products" element={<MainLayout><Products /></MainLayout>} />
      <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
      <Route path="/gallery" element={<MainLayout><GalleryImages /></MainLayout>} />
      <Route path="/gallery/images" element={<MainLayout><GalleryImages /></MainLayout>} />
      <Route path="/gallery/videos" element={<MainLayout><GalleryVideos /></MainLayout>} />
      <Route path="/gallery/news" element={<MainLayout><GalleryNews /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
      <Route path="/donation" element={<MainLayout><Donation /></MainLayout>} />


      {/* Legal Policy Routes */}
      <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
      <Route path="/terms-conditions" element={<MainLayout><TermsConditions /></MainLayout>} />
      <Route path="/refund-cancellation-policy" element={<MainLayout><RefundCancellationPolicy /></MainLayout>} />
      <Route path="/donation-fund-flow-policy" element={<MainLayout><DonationFundFlowPolicy /></MainLayout>} />
      <Route path="/shipping-delivery-policy" element={<MainLayout><ShippingDeliveryPolicy /></MainLayout>} />

      {/* Cow Rescue Module Routes (Only backend-supported pages) */}
      <Route path="/cow-rescue" element={<MainLayout><CowRescueHome /></MainLayout>} />
      <Route path="/cow-rescue/report" element={<MainLayout><ReportIncident /></MainLayout>} />
      <Route path="/cow-rescue/track" element={<MainLayout><TrackRescue /></MainLayout>} />
      <Route path="/cow-rescue/alert/:token" element={<MainLayout><AlertResponse /></MainLayout>} />
<Route path="/ngo/bank-details/:token" element={<NgoBankDetails />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AppRoutes;