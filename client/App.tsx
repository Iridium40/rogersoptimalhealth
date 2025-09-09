import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "@/components/site/Layout";
import About from "@/pages/About";
import Recipes from "@/pages/Recipes";
import Contact from "@/pages/Contact";
import BookAssessment from "@/pages/BookAssessment";
import ProgramOverview from "@/pages/ProgramOverview";
import FAQs from "@/pages/FAQs";
import MyStory from "@/pages/MyStory";
import WhyCoaching from "@/pages/WhyCoaching";
import GetStarted from "@/pages/GetStarted";
import Privacy from "@/pages/Privacy";
import BookWithLenee from "@/pages/BookWithLenee";
import BlogGLP1Eating from "@/pages/blog/GLP1Eating";
import BlogHydration from "@/pages/blog/Hydration";
import BlogSleep from "@/pages/blog/Sleep";
import BlogPortions from "@/pages/blog/Portions";
import BlogProtein from "@/pages/blog/Protein";
import BlogMeditationMovement from "@/pages/blog/MeditationMovement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/program" element={<ProgramOverview />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/connect" element={<Contact />} />
          <Route path="/book-assessment" element={<BookAssessment />} />
          <Route path="/my-story" element={<MyStory />} />
          <Route path="/why-coaching" element={<WhyCoaching />} />
          <Route path="/book-with-kayce" element={<BookWithLenee />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route
            path="/blog/eating-right-on-glp1"
            element={<BlogGLP1Eating />}
          />
          <Route
            path="/blog/drinking-enough-water"
            element={<BlogHydration />}
          />
          <Route path="/blog/getting-enough-sleep" element={<BlogSleep />} />
          <Route path="/blog/right-portions" element={<BlogPortions />} />
          <Route path="/blog/enough-protein" element={<BlogProtein />} />
          <Route
            path="/blog/meditation-healthy-movement"
            element={<BlogMeditationMovement />}
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
