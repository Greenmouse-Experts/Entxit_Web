import { createFileRoute, Outlet } from "@tanstack/react-router";
import HomeNav from "@/components/HomeNav";

export const Route = createFileRoute("/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <HomeNav />
      <section className="min-h-[calc(100dvh-5rem)] w-full container mx-auto ">
        <div className="flex min-h-[calc(100dvh-5rem)] w-full flex-col md:w-1/2 ">
          <div className="flex flex-1 items-center  ">
            <div className="mx-auto w-full ring  p-4 fade rounded-xl py-8 lg:py-2">
              <Outlet />
            </div>
          </div>
          <footer className="p-6 text-center text-xs text-base-content/50 md:hidden">
            © 2026 EntXit
          </footer>
        </div>
        <aside className="fixed bottom-0 right-0 top-20 hidden w-1/2 p-4 md:block lg:p-6">
          <img
            src="/onboarding/side-new.jpeg"
            alt="EntXit dashboard illustration"
            className="h-full w-full rounded-box object-cover"
          />
        </aside>
      </section>
    </>
  );
}
