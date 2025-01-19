# VIZ.IT - Project setup guide

Introducing <i>viz.it</i>, the app that transforms learning into a visual journey! Whether you're a <u>teacher</u> or a <u>student</u>, <i>viz.it</i> empowers you to create stunning visual explanations of learning materials in <u>any language</u>—no technical skills required. Simply upload your content, and the app will help you design interactive and engaging visuals to enhance understanding and retention. Perfect for multilingual classrooms or self-learners, <b>viz.it makes learning accessible and enjoyable for everyone</b>.

## Prerequisites
- Python and Node.js installed on your system
- Bash shell (available on most Unix-based systems, including Linux and macOS)

## Installation Steps

### Step 1: Install Server Dependencies
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install the required Python packages using pip:
   ```bash
   pip install -r requirements.txt
   ```

### Step 2: Install Client Dependencies
1. Navigate to the `client` folder from root folder:
   ```bash
   cd client
   ```
2. Install the required Node.js packages using npm:
   ```bash
   npm install
   ```

### Step 3: Run the applicaiton
1. Navigate to project root folder:
   ```bash
   cd ..
   ```
2. Execute `runner.sh` script:
   ```bash
   bash runner.sh
   ```

## Notes

* Ensure you have all required dependencies and permissions to execute bash scripts.

* If you encounter any issues, please refer to the troubleshooting section below.

## Troubleshooting

* #### Error with pip installation:

    * Ensure you have pip installed and it’s added to your system’s PATH.

    * Use a virtual environment to avoid conflicts:

    ```bash
    python -m venv env
    source env/bin/activate  # On Windows, use `env\\Scripts\\activate`
    pip install -r requirements.txt
    ```
* #### Permission denied when running `runner.sh` script:
    * Make the script executable by running:
    ```bash
    chmod +x runner.sh
    ```
    * Then, retry running the script.



Created by Artem Pazych, Elizaveta Firsova, and Nazif Ishrak