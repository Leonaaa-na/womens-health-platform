Question 1A — React Conventions Used
   These  are some of the conventions i have or are using for my project;
1. Separate and reusable components
2. Import and export
3. Using .map() to render multiple routes
4. Using props
5. Using the children prop
6. Conditional rendering
7. Reusable layouts
8. React Router for navigation
9. Protected routes / authentication gates
10. Using TypeScript with React

Question 1B — Explanation of the React Conventions

1. Separate and Reusable Components

Convention: Breaking the application into small, reusable
components.

What it means: Instead of putting the whole application in one large
file, React allows us to divide the user interface into smaller
components.

Why we used it: We used separate components so common parts of the
application can be created once and reused in different places. This
reduces repetition and makes the code easier to maintain.

How we used it: We created components such as Navbar, Sidebar,
and Wrapper.

When it is useful: It is useful whenever the same part of an
interface needs to appear on multiple pages.

Example:

```tsx
<Navbar />
```

────────

2. Import and Export

Convention: Using import and export to share components and code
between files.

What it means: A component can be exported from one file and
imported into another file when it is needed.

Why we used it: Our project is divided into many files, so importing
and exporting allows the different parts of the application to work
together.

How we used it:

```tsx
export default Navbar;
```

Then:

```tsx
import Navbar from "../components/Navbar";
```

When it is useful: Whenever code needs to be organized into separate
files while still being reused elsewhere.

────────

3. Using .map() to Render Multiple Routes

Convention: Using JavaScript’s .map() method to generate React
elements from an array.

What it means: .map() goes through each item in an array and
returns something for each item.

Why we used it: Our routes have the same general structure. By
storing route information in an array and mapping over it, we avoid
repeating the same <Route> code manually. It also makes adding or
removing routes easier.

How we used it:

```tsx
publicRoutes.map((route) => (
  <Route
    key={route.path}
    path={route.path}
    element={route.element}
  />
))
```

When it is useful: When displaying or creating multiple similar
React elements from a list of data, such as routes, navigation links,
products, or users.

────────

4. Using Props

Convention: Passing information from one component to another using
props.

What it means: Props allow a parent component to send information to
a child component.

Why we used it: Props make components flexible because the same
component can behave differently depending on the information it
receives.

Example:

```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello {name}</h1>;
}
```

It can be used as:

```tsx
<Greeting name="Ama" />
```

When it is useful: Whenever a component needs data or configuration
from another component.

────────

5. Using the children Prop

Convention: Using children to allow a component to display content
placed inside it.

What it means: children represents whatever is placed between a
component’s opening and closing tags.

Why we used it: We used this concept with our Wrapper and layouts so
the same structure can contain different pages or content.

Example:

```tsx
function Wrapper({ children }) {
  return <div>{children}</div>;
}
```

Then:

```tsx
<Wrapper>
  <Home />
</Wrapper>
```

When it is useful: For wrappers, layouts, cards, modals, and other
reusable components that need to contain different content.

────────

6. Conditional Rendering

Convention: Displaying different content depending on a condition.

What it means: React allows us to decide what should be displayed
based on a value or condition.

Why we used it: Our application has different experiences for
authenticated and unauthenticated users. The application needs to
respond differently depending on the user’s authentication state.

Example:

```tsx
{isLoggedIn ? <Dashboard /> : <Login />}
```

When it is useful: For authentication, loading states, error
messages, empty states, and different user experiences.

────────

7. Reusable Layouts

Convention: Creating layouts that provide a common structure for
multiple pages.

What it means: A layout contains parts of the interface that should
remain consistent while the page content changes.

Why we used it: We used layouts to prevent repeating common page
structures on every page.

We created:

```text
AuthLayout.tsx
UnauthLayout.tsx
```

The unauthenticated layout can provide:

```text
Navbar
   ↓
Page
   ↓
Footer
```

The authenticated layout can provide:

```text
Sidebar
   ↓
Authenticated Page
```

When it is useful: When several pages share the same navigation,
sidebar, footer, or overall structure.

────────

8. React Router for Navigation

Convention: Using React Router to manage navigation between pages.

What it means: React Router connects URLs to React components and
allows users to move between different views of the application.

Why we used it: Our application contains several pages, so React
Router gives us an organized way to associate each URL with the correct
page.

How we used it:

```tsx
<Route path="/about" element={<About />} />
```

This means that when the user visits /about, the About component is
rendered.

When it is useful: For React applications that have multiple pages
or views and need URL-based navigation.

────────

9. Protected Routes / Authentication Gates

Convention: Restricting certain routes to authenticated users.

What it means: A protected route checks whether a user has
permission to access a particular page before rendering that page.

Why we used it: Some parts of an application contain user-specific
information and should not be accessible to everyone. An authentication
gate helps ensure that private pages are only available to users who
have been authenticated.

How we used it: We created a ProtectedRoute.tsx component that is
intended to check the user’s authentication status before allowing
access to protected pages.

```text
User requests a protected page
          ↓
Check authentication
       ↙       ↘
     YES        NO
      ↓          ↓
   Page        Login
```

When it is useful: For dashboards, profiles, account settings, admin
areas, and any page that should only be accessible to logged-in users.

────────

10. Using TypeScript with React

Convention: Using TypeScript for React components.

What it means: TypeScript allows us to specify the types of values
that components, props, and functions should receive.

Why we used it: Our project uses React with TypeScript, so our React
components use the .tsx extension. TypeScript also helps identify
certain errors while developing.

Example:

```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello {name}</h1>;
}
```

Here, name: string tells TypeScript that name should contain text.

When it is useful: Especially in larger applications because it
makes code easier to understand and can catch type-related mistakes
before the application runs.

Question 1C — My Understanding of What I Implemented

From this project, I understand that React allows me to break an application into small, reusable components instead of putting everything in one file. I used components such as the Navbar, Sidebar, and Wrapper to make the project more organized and reusable.

I also learned how React Router is used to connect different URLs to different pages such as Home, About, Contact, Login, and Signup. The react-router-dom package provides components such as Route and Routes that help manage this navigation.

I used layouts to create different structures for authenticated and unauthenticated users. This prevents me from repeating the same Navbar, Footer, or Sidebar code on every page.

I also implemented protected routes, which help restrict private pages to users who are authenticated. This means a user who is not logged in should not be able to access pages that require authentication.

Another thing I learned is how .map() can be used to create multiple React elements from an array. In my project, it helps me generate routes without having to write the same route structure repeatedly.

I also learned how props and the children prop allow components to receive information or content from other components. This makes components and layouts more flexible and reusable.

Overall, I understand that the structure I implemented makes my React application more organized, reusable, easier to maintain, and easier to expand with new features.