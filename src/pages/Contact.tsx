import FormInput from "../components/FormInput";

function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-pink-50 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-widest text-pink-600">
            HerBloom Support
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
            Contact Us
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Have a question, suggestion, or need more information?
            We'd love to hear from you.
          </p>

        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">

          {/* Contact Information */}
          <div>

            <p className="text-sm font-semibold uppercase tracking-widest text-pink-600">
              Contact Information
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              We're Here to Help
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Whether you have a question about HerBloom, need help
              using a feature, or have suggestions for improving the
              platform, feel free to reach out to us.
            </p>

            <div className="mt-8 space-y-6">

              {/* Email */}
              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-2xl">
                  📧
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Email
                  </h3>

                  <p className="mt-1 text-gray-600">
                    support@herbloom.com
                  </p>
                </div>

              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-2xl">
                  📞
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Phone
                  </h3>

                  <p className="mt-1 text-gray-600">
                    +233 00 000 0000
                  </p>
                </div>

              </div>

              {/* Location */}
              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-2xl">
                  📍
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Location
                  </h3>

                  <p className="mt-1 text-gray-600">
                    Ghana
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl bg-white p-8 shadow-md">

            <h2 className="text-2xl font-bold text-gray-900">
              Send Us a Message
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Fill in the form below and we'll get back to you.
            </p>

            <form className="mt-6 space-y-5">

              {/* Name */}
              <FormInput
                label="Full Name"
                type="text"
                name="name"
                placeholder="Enter your full name"
              />

              {/* Email */}
              <FormInput
                label="Email Address"
                type="email"
                name="email"
                placeholder="Enter your email"
              />

              {/* Subject */}
              <FormInput
                label="Subject"
                type="text"
                name="subject"
                placeholder="What is your message about?"
              />

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* Bottom Message */}
      <section className="bg-pink-600 px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-pink-100">
            Her health. Her journey. Her bloom.
          </p>

          <h2 className="text-2xl font-bold text-white">
            Your Questions Matter
          </h2>

          <p className="mt-3 leading-7 text-pink-100">
            We're committed to creating a platform that listens to
            women's needs and continuously improves to provide better
            health support.
          </p>

        </div>
      </section>

    </div>
  );
}

export default Contact;