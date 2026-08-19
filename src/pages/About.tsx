function About() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-pink-50 px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-pink-600">
            About Our Platform
          </p>

          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Supporting Women Through Every Stage of Their Health Journey
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            The Women's Health Platform is designed to provide women with
            accessible tools, information, and support to help them better
            understand and manage their health.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-pink-600">
                Who We Are
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                A Digital Space Created With Women in Mind
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                Women's health involves different needs and experiences
                throughout life. Our platform brings important health
                management and support services together in one convenient
                digital environment.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                From menstrual health and pregnancy support to health
                education and access to professional assistance, the
                platform is designed to make important resources easier
                to access and understand.
              </p>
            </div>

            <div className="rounded-2xl bg-pink-100 p-10 text-center">
              <div className="text-7xl">🌸</div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                Your Health Matters
              </h3>

              <p className="mt-3 text-gray-600">
                Better information can lead to better awareness,
                better preparation, and better health decisions.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">

          <div className="grid gap-8 md:grid-cols-2">

            {/* Mission */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-5 text-4xl">🎯</div>

              <h2 className="text-2xl font-bold text-gray-900">
                Our Mission
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Our mission is to provide a reliable and user-friendly
                platform that helps women access health information,
                manage important health activities, and find appropriate
                support when needed.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-5 text-4xl">💡</div>

              <h2 className="text-2xl font-bold text-gray-900">
                Our Vision
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Our vision is to create a trusted digital health
                environment where women can confidently manage their
                health and access useful resources throughout different
                stages of life.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* What We Aim To Provide */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              What We Aim To Provide
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              The platform is designed around several important areas
              of women's health and well-being.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl border border-gray-100 p-6">
              <div className="text-3xl">🌸</div>
              <h3 className="mt-4 font-semibold text-gray-900">
                Health Tracking
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Tools for recording and monitoring important health
                information.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-6">
              <div className="text-3xl">📖</div>
              <h3 className="mt-4 font-semibold text-gray-900">
                Education
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Accessible educational resources covering important
                women's health topics.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-6">
              <div className="text-3xl">🩺</div>
              <h3 className="mt-4 font-semibold text-gray-900">
                Professional Support
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Support and access to appropriate healthcare professionals.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-6">
              <div className="text-3xl">🚨</div>
              <h3 className="mt-4 font-semibold text-gray-900">
                Emergency Assistance
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Features designed to help users access emergency support
                when necessary.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default About;