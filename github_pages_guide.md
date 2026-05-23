# Step-by-Step Guide: Hosting your Habit Tracker on GitHub Pages

This guide outlines exactly how to host your newly created **Pastel Aesthetic Habit Tracker** website on your personal GitHub account for free.

---

## Prerequisites
1. Ensure you have **Git** installed on your system.
2. Ensure you have a **GitHub Account**. (If not, create one at [github.com](https://github.com/)).

---

## Step 1: Initialize Git in your Habit Tracker Directory
Open **Terminal** or **Git Bash** on your computer and navigate to your habit tracker project directory, then run the initialization commands:

```bash
# Navigate to your habit tracker project directory
d:
cd d:\Learning\Projects\habit-tracker

# Initialize a new Git repository
git init

# Add all files to staging
git add .

# Create the initial commit
git commit -m "Initialize Pastel Aesthetic Habit Tracker"
```

---

## Step 2: Create a New GitHub Repository
1. Log in to [github.com](https://github.com/).
2. In the top-right corner of the page, click the `+` dropdown and select **New repository**.
3. Fill out the repository details:
   - **Repository name**: `habit-tracker`
   - **Description**: *A gorgeous, interactive Pastel Aesthetic Habit Tracker matching my excel sheet!*
   - **Public/Private**: Select **Public** (required for free GitHub Pages hosting).
   - **Initialize this repository with**: Leave **all** checkbox options (README, .gitignore, license) **UNCHECKED** (we are pushing an existing codebase).
4. Click **Create repository**.

---

## Step 3: Link your Local Git and Push
After creating the repository, GitHub will show a page with terminal commands under **"…or push an existing repository from the command line"**. 

Copy and execute these commands in your local terminal:

```bash
# Rename default branch to main
git branch -M main

# Link your local repository to your remote GitHub repository
# IMPORTANT: Replace <your-username> with your actual GitHub username!
git remote add origin https://github.com/<your-username>/habit-tracker.git

# Push the code to GitHub
git push -u origin main
```

*(Note: If prompted, log in with your GitHub credentials or authorize via browser/personal access token).*

---

## Step 4: Enable GitHub Pages
Once your files are pushed successfully to GitHub:
1. Open your repository `habit-tracker` in your web browser on GitHub.
2. Click on the **Settings** tab (gear icon at the top).
3. In the left-side navigation menu, scroll down to the **Code and automation** section and click **Pages**.
4. Under **Build and deployment**:
   - **Source**: Select **Deploy from a branch** (default).
   - **Branch**: Click the dropdown (currently *None*), select **main** (and leave the directory as `/ (root)`).
   - Click **Save**.

---

## Step 5: Visit your Live Website!
GitHub will take a few seconds to compile and deploy your static site. 
1. Refresh the Pages settings tab after 30 seconds.
2. At the top of the Page settings page, you will see a banner saying: 
   > **"Your site is live at https://<your-username>.github.io/habit-tracker/"**
3. Click the link to open your live, beautifully animated Pastel Aesthetic Habit Tracker on the web!

You can now use this habit tracker on your laptop, tablet, or phone, and all of your data will be securely stored in your local browser's storage!
