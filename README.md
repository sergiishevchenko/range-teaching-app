# Range Teaching App

A web application that teaches the concept of "Range" in data visualization through an interactive bubble graph.

## Tech Stack

- **Frontend**: React 18.2.0 with JSX components and CSS Modules
- **Backend**: Django 4.2.7 with Django REST Framework
- **Visualization**: Recharts 2.10.3
- **HTTP Client**: Axios

## Features

- Interactive bubble graph based on "Metro Systems of the World" example
- Drag-and-drop functionality to move data points along x and y axes
- Tutor component explaining the concept of Range
- Challenge system with 18 different range target types
- Real-time feedback on user submissions
- Beautiful, modern UI with gradient backgrounds
- Custom favicon matching the app theme

## Installation

### Quick Start

You can use the provided shell scripts for quick setup:

**Backend:**
```bash
./start_backend.sh
```

**Frontend (in a new terminal):**
```bash
./start_frontend.sh
```

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file for environment variables:
```bash
# Copy example file
cp ../.env.example .env
# Edit .env with your values (or use defaults)
```

5. Run migrations (creates tables for Django's built-in apps like sessions, auth, etc.):
```bash
python manage.py migrate
```

6. Start the Django server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

**Note**: The `.env` file is optional. If not present, the app will use default values from `settings.py`.

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. (Optional) Create `.env` file for environment variables:
```bash
# Create .env file
echo "REACT_APP_API_BASE_URL=http://localhost:8000/api" > .env
```

3. Install dependencies:
```bash
npm install
```

4. Start the React development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

**Note**: The `.env` file is optional. If not present, the app will use `http://localhost:8000/api` as default.

## Usage

1. Start both the backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Read the tutor section to understand what Range means
4. View the challenge and try to achieve the target range
5. Click and drag the bubbles to move them along the y-axis
6. Click "Submit Answer" to check if your range is correct
7. Get feedback and try again or start a new challenge

## API Endpoints

- `GET /api/data/` - Get initial graph data
- `GET /api/challenge/` - Get a random challenge
- `POST /api/validate/` - Validate if the user's graph meets the challenge requirements

## Project Structure

```
tt-schole-ai/
├── backend/
│   ├── api/
│   │   ├── views.py          
│   │   ├── urls.py          
│   │   ├── challenges.py     
│   │   └── graph_data.py     
│   ├── range_app/
│   │   ├── settings.py      
│   │   └── urls.py          
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.svg     
│   ├── src/
│   │   ├── components/
│   │   │   ├── BubbleGraph.jsx
│   │   │   ├── BubbleGraph.module.css
│   │   │   ├── Tutor.jsx
│   │   │   ├── Tutor.module.css
│   │   │   ├── Feedback.jsx
│   │   │   └── Feedback.module.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── start_backend.sh         
├── start_frontend.sh         
└── README.md
```

## Challenge Types

The app supports 18 different challenge variations across four main types:

1. **Less Than** (5 variations): Make the range lower than a specified value (200, 250, 300, 350, 400)
2. **Greater Than** (5 variations): Make the range greater than a specified value (200, 250, 300, 350, 400)
3. **Between** (4 variations): Make the range between two values (100-500, 150-400, 200-450, 250-350)
4. **Exact** (4 variations): Make the range exactly match specified min and max values

Challenges are randomly selected from `backend/api/challenges.py` on each request.

## Code Organization

- **Data Separation**: Graph data and challenge types are stored in separate Python files (`graph_data.py`, `challenges.py`) for better organization
- **CSS Modules**: Component styles use CSS Modules (`.module.css`) for style isolation
- **JSX Components**: All React components use `.jsx` extension for clarity
- **Modular Structure**: Clean separation between frontend components and backend API

## Development Notes

- Backend uses Django REST Framework for API endpoints
- Frontend uses Recharts for bubble graph visualization
- CORS is configured to allow frontend-backend communication
- All styles are scoped to components using CSS Modules
