# DevsAround Technical Exercise (Backend)

## Intro

Built with `create-next-app`, this is a NextJS food delivery-related app for real-time streaming.

![Order Tracker screenshot](./public/assessment%20screenshot%20-%20order%20tracker.png)

## Quick start

1. Clone the repo: `git clone {REPO_URL}`

2. CD into the repo: `cd /path/to/repo`

3. Install dependencies: `npm install`

4. [Option 1: Docker] Bootstrap via docker compose: `docker-compose up`. This needs your to have docker app installed in your machine. Rest

5. [Option 2: NPM] Create a `.env` file at the root level of the repo with the following contents: "MONGODB_URI=mongodb://localhost:27017/order-tracker". Run MongoDB locally on the default port, then start the app via `npm run dev`.


6. Once running, visit `http://localhost:3000/` to load the app--the first load might be slow. You should see the following page if everything is successful:
![Home screenshot](./public/assessment%20screenshot%20-%20home.png)

7. Click on the "Create seed" button to bootstrap the drivers data once you are ready.

8. You can now start using the app! Follow the notion instructions.

## Sample git workflow

Here is a sample flow for making changes and submitting a PR after completing the exercise:

```
// check out a new branch for your changes
git checkout -b {BRANCH_NAME}

// make changes and commit them
git add --all
git commit

// push new branch up to GitHub
git push origin {BRANCH_NAME}

// use GitHub to make PR
// (DO NOT MERGE PR)
```