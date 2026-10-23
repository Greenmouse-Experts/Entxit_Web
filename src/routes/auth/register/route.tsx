import { createFileRoute, Outlet } from "@tanstack/react-router";
import HomeNav from "@/components/HomeNav";

export const Route = createFileRoute("/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <HomeNav />

      <section className="grid grid-cols-2 w-full container mx-auto relative isolate ">
        {/* Left Side: Form Content */}
        <div className="flex w-full flex-col ">
          <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-24">
            <div className="w-full max-w-md mx-auto">
              <Outlet />
            </div>
          </div>

          {/* Mobile-only footer */}
          <div className="p-6 text-center text-xs opacity-50 lg:hidden">
            © 2026 EntXit
          </div>
        </div>

        {/* Right Side: Image (Hidden on mobile) */}
        <div className="hidden  h-[600px] self-center w-full md:block sticky top-0">
          <img
            src="/onboarding/side-image.png"
            alt="EntXit dashboard illustration"
            className="h-full w-full object-cover rounded-xl"
          />
        </div>
      </section>
    </>
  );
}
