import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-pink-50 px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">

          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-pink-600">
            Her health. Her journey. Her bloom.
          </p>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
            Welcome to{" "}
            <span className="text-pink-600">
              HerBloom
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            A supportive health platform designed to help women
            understand, manage, and take control of their health
            through tracking, education, reliable resources, and
            professional support.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="rounded-lg bg-pink-600 px-7 py-3 font-semibold text-white transition hover:bg-pink-700"
            >
              Get Started
            </button>

            <button
              type="button"
              onClick={() => navigate("/about")}
              className="rounded-lg border border-pink-600 px-7 py-3 font-semibold text-pink-600 transition hover:bg-pink-100"
            >
              Learn More
            </button>

          </div>

        </div>
      </section>

      {/* Introduction Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-pink-600">
            HerBloom
          </p>

          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Your Health, Your Journey
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-7 text-gray-600">
            Women's health involves different stages, experiences,
            and needs. HerBloom brings essential health tools,
            education, support, and resources together in one
            convenient place.
          </p>

        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">

            <h2 className="text-3xl font-bold text-gray-900">
              Explore HerBloom
            </h2>

            <p className="mt-3 text-gray-600">
              Tools and resources to support you through every stage
              of your health journey.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* Menstrual Health */}
            <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">

              <div className="mb-4 text-3xl">
                🌸
              </div>

              <h3 className="text-xl font-semibold text-gray-900">
                Menstrual Health
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Track cycles, symptoms, moods, medication,
                nutrition, wellness, and important cycle information.
              </p>

            </div>

            {/* Pregnancy */}
            <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">

              <div className="mb-4 text-3xl">
                🤰
              </div>

              <h3 className="text-xl font-semibold text-gray-900">
                Pregnancy Support
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Follow pregnancy milestones, symptoms, nutrition,
                wellness, and other important pregnancy information.
              </p>

            </div>

            {/* Health Library */}
            <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">

              <div className="mb-4 text-3xl">
                📚
              </div>

              <h3 className="text-xl font-semibold text-gray-900">
                Health Library
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Explore reliable health information, articles,
                medical sources, and educational resources.
              </p>

            </div>

            {/* Professional Support */}
            <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">

              <div className="mb-4 text-3xl">
                🩺
              </div>

              <h3 className="text-xl font-semibold text-gray-900">
                Professional Support
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Find healthcare professionals and access support
                when you need it.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-pink-600 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-widest text-pink-100">
            Her health. Her journey. Her bloom.
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Begin Your HerBloom Journey
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-pink-100">
            Create your account and take the next step toward
            understanding and managing your health.
          </p>

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="mt-7 rounded-lg bg-white px-7 py-3 font-semibold text-pink-600 transition hover:bg-pink-50"
          >
            Create Your Account
          </button>

        </div>
      </section>

    </div>
  );
}

export default Home;