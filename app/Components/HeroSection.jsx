import Image from "next/image";
import NavLink from "./ui/NavLink";

export default function Hero() {
  return (
    <section>
      <div className="custom-screen pt-28 text-gray-600">
        <div className="space-y-5 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl">
            Explore Advanced Simulations Instantly
          </h1>
          <p className="max-w-xl mx-auto">
            Dive into powerful simulations, including Monte Carlo, Brownian
            Motion, and Portfolio Income Analysis. Gain insights in seconds for
            free!
          </p>
          <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
            <NavLink
              href="/start"
              className="text-white bg-gray-800 hover:bg-gray-600 active:bg-gray-900 "
            >
              Start Simulations
            </NavLink>
            <NavLink
              target="_blank"
              href="https://github.com/your-simulations-repo"
              className="text-gray-700 border hover:bg-gray-50"
              scroll={false}
            >
              Learn More
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}
