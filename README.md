# EmployWise Assignment

A React app for user management using the Reqres API.

## Features
- Login with token persistence
- Paginated user list with search/filtering
- Edit and delete users with validation
- Responsive UI with Tailwind CSS
- Loading states and error handling

## How to Run Locally
1. Clone the repo: `git clone <your-repo-link>`
2. Install dependencies: `npm install`
3. Start the app: `npm start`
4. Open `http://localhost:3000` in your browser.

## Deploy to Heroku
1. Install Heroku CLI and log in: `heroku login`
2. Create a Heroku app: `heroku create employwise-assignment`
3. Add a `Procfile` with: `web: npm start`
4. Update `package.json` scripts with `"start": "react-scripts start"`
5. Commit and push: `git push heroku main`
6. Open the app: `heroku open`

## Dependencies
- React
- Axios
- React Router DOM
- Tailwind CSS

## Notes
- Login with `eve.holt@reqres.in` and `cityslicka`.
- Token stored in localStorage.
- Hosted link: (add after deployment)