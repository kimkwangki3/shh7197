import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Vote from "@/pages/Vote";
import Suggestions from "@/pages/Suggestions";
import Board from "@/pages/Board";
import Promises from "@/pages/Promises";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/votes" component={Vote} />
        <Route path="/suggestions" component={Suggestions} />
        <Route path="/board" component={Board} />
        <Route path="/promises" component={Promises} />
        <Route path="/profile" component={Profile} />
        <Route path="/admin" component={Admin} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
