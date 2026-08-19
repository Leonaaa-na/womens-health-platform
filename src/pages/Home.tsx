function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-pink-50 px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">

          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-pink-600">
            Your Health. Your Well-being. Your Future.
          </p>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
            Empowering Women Through
            <span className="text-pink-600"> Better Health Management</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            A comprehensive platform designed to help women understand,
            manage, and take control of their health through tracking,
            education, professional support, and reliable health resources.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-pink-600 px-7 py-3 font-semibold text-white transition hover:bg-pink-700">
              Get Started
            </button>

            <button className="rounded-lg border border-pink-600 px-7 py-3 font-semibold text-pink-600 transition hover:bg-pink-100">
              Learn More
            </button>
          </div>

        </div>
      </section>

      {/* Introduction Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl text-center">

          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            A Health Platform Built With Women in Mind
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-gray-600 leading-7">
            Women's health involves many different stages and needs.
            Our platform brings important health management and support
            features together in one convenient place.
          </p>

        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              What We Offer
            </h2>

            <p className="mt-3 text-gray-600">
              Tools and resources designed to support your health journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* Feature 1 */}
            <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-4 text-3xl">🌸</div>

              <h3 className="text-xl font-semibold text-gray-900">
                Menstrual Health
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Keep track of menstrual cycles, symptoms, moods, and
                important cycle information.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-4 text-3xl">🤰</div>

              <h3 className="text-xl font-semibold text-gray-900">
                Pregnancy Support
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Access useful pregnancy information and keep track of
                important stages and milestones.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-4 text-3xl">📚</div>

              <h3 className="text-xl font-semibold text-gray-900">
                Health Education
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Learn about important women's health topics using
                accessible and informative resources.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-4 text-3xl">🩺</div>

              <h3 className="text-xl font-semibold text-gray-900">
                Professional Support
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Connect with healthcare professionals and access
                support when you need it.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-pink-600 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">

          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Take Charge of Your Health
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-pink-100">
            Start your journey toward better health awareness,
            management, and support.
          </p>

          <button className="mt-7 rounded-lg bg-white px-7 py-3 font-semibold text-pink-600 transition hover:bg-pink-50">
            Create Your Account
          </button>

        </div>
      </section>

    </div>
  );
}

export default Home;