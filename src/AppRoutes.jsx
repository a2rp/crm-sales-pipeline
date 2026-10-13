import { lazy, Suspense } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading";
import shared from "./pages/shared.module.css";

const Overview = lazy(() => import("./pages/overview"));
const Pipeline = lazy(() => import("./pages/pipeline"));
const Contacts = lazy(() => import("./pages/contacts"));
const Activities = lazy(() => import("./pages/activities"));
const Search = lazy(() => import("./pages/search"));

const NotFound = () => (
  <div className={shared.page}>
    <section className={`${shared.panel} ${shared.empty}`}>
      <strong>That page isn’t in this workspace.</strong>
      <p>Use the navigation to return to your sales overview.</p>
      <Link className={shared.primaryButton} to="/overview">Go to overview</Link>
    </section>
  </div>
);

const AppRoutes = ({ pageProps }) => {
  const location = useLocation();
  return (
    <Suspense key={location.pathname} fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview {...pageProps} />} />
        <Route path="/pipeline" element={<Pipeline {...pageProps} />} />
        <Route path="/contacts" element={<Contacts {...pageProps} />} />
        <Route path="/activities" element={<Activities {...pageProps} />} />
        <Route path="/search" element={<Search {...pageProps} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
