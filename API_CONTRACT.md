# API Contract: AI Career Development Agent

This specification documents the REST API contract for communication between the frontend client and the Node.js Express backend.

---

## 1. System Invariants & Conventions

1. **Two-Stage Confirmation Pattern**:
   - Profiles start as `"draft"`. Match and draft endpoints strictly reject unconfirmed profiles (`HTTP 400`).
   - The student explicitly confirms via `POST /api/profile/:id/confirm`.
   - The student explicitly confirms a 7-day development plan via `POST /api/plans/confirm`.
2. **Deterministic Scoring (Zero AI, Zero DB for scores)**:
   - Scoring is performed solely by pure JavaScript code.
   - The matching loop exposes `search_and_score_opportunities` as a model-selected tool; the server injects the confirmed profile, and the AI never produces or modifies scores.
3. **Internal Agent Tools**:
   - `search_and_score_opportunities`: Model-selected in match step.
   - `find_learning_resources`: Model-selected in plan drafting step.
   - `save_development_plan`: **Not exposed to the model**. Invoked exclusively by the server during the plan confirmation endpoint (`POST /api/plans/confirm`), with server-derived `studentConfirmed: true`, and logged in the execution tool-call log.
4. **Evidence Substring Verification**:
   - Every extracted skill carries a `sourceReference` (verbatim CV excerpt).
   - Server normalizes whitespace and casing when verifying against `cv_text`.
   - Unverified evidence is **demoted** (e.g., to status `"listed"` with `verified: false`), never silently dropped.
5. **Mock Mode Safety (`MOCK_AI`)**:
   - If `MOCK_AI=true`, endpoints return deterministic stub responses carrying `"mock": true`.
   - The server **strictly refuses to start** if `MOCK_AI=true` and `NODE_ENV=production`.
6. **Error Response Format**:
   All error responses adhere to:
   ```json
   {
     "error": {
       "code": "ERROR_CODE_STRING",
       "message": "Human-readable explanation of error.",
       "details": []
     }
   }
   ```

---

## 2. Endpoints Overview

| Method | Path | Description | Access / State Req |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health, DB connection status, environment | Public |
| `POST` | `/api/profile/extract` | Extract skills & quotes from raw CV text | Creates `draft` profile |
| `PUT` | `/api/profile/:id` | Edit extracted skills in draft profile | Profile must be `draft` |
| `POST` | `/api/profile/:id/confirm` | Confirm student profile | Transitions `draft` $\rightarrow$ `confirmed` |
| `POST` | `/api/opportunities/match` | Rank 5 opportunities & get AI explanation | Requires `confirmed` profile |
| `POST` | `/api/plans/draft` | Bounded agent drafts 7-day plan using resources | Requires `confirmed` profile |
| `POST` | `/api/plans/confirm` | Revalidate invariants & persist plan with snapshot | Requires `confirmed` profile |
| `GET` | `/api/plans` | List all saved plans with profile snapshots | Public / Student |
| `GET` | `/api/plans/:id` | Retrieve single plan by UUID | Public / Student |
| `PATCH`| `/api/plans/:id/activities/:day`| Update completion status of activity | Plan must exist |

---

## 3. Detailed Endpoint Specifications

### 3.1 `GET /api/health`
Checks server health, uptime, and database connectivity.

* **Request**: None
* **Response `200 OK`**:
```json
{
  "status": "ok",
  "service": "career-agent-backend",
  "environment": "development",
  "database": "connected",
  "mockMode": false,
  "timestamp": "2026-10-24T12:00:00.000Z",
  "uptimeSeconds": 142.8
}
```

---

### 3.2 `POST /api/profile/extract`
Parses raw CV text using `@google/genai` (or mock), validates evidence quotes against CV with whitespace/case normalization, demotes unverified quotes, and saves a `draft` profile.

* **Request Body**:
```json
{
  "cvText": "Alex Rivera\nSoftware Engineering Student\nExperience:\n- Built REST APIs in Node.js and Express for university portal\n- Managed PostgreSQL database queries and migrations\nSkills: Python, Docker, Git"
}
```

* **Response `201 Created`**:
```json
{
  "profileId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "status": "draft",
  "skills": [
    {
      "name": "Node.js",
      "status": "demonstrated",
      "evidence": "Built REST APIs in Node.js and Express for university portal",
      "sourceReference": "Built REST APIs in Node.js and Express",
      "verified": true
    },
    {
      "name": "Express",
      "status": "demonstrated",
      "evidence": "Built REST APIs in Node.js and Express for university portal",
      "sourceReference": "Express",
      "verified": true
    },
    {
      "name": "PostgreSQL",
      "status": "demonstrated",
      "evidence": "Managed PostgreSQL database queries and migrations",
      "sourceReference": "Managed PostgreSQL database queries",
      "verified": true
    },
    {
      "name": "Python",
      "status": "listed",
      "evidence": "Skills: Python, Docker, Git",
      "sourceReference": "Python",
      "verified": true
    },
    {
      "name": "Kubernetes",
      "status": "not-established",
      "evidence": "Mentioned interest in cloud",
      "sourceReference": "Orchestrated Kubernetes clusters in production",
      "verified": false,
      "verificationNote": "Quote not located in CV text; demoted from demonstrated to not-established."
    }
  ],
  "mock": false,
  "createdAt": "2026-10-24T12:00:05.123Z"
}
```

---

### 3.3 `PUT /api/profile/:id`
Allows the student to adjust skill names, modify statuses (`demonstrated`, `listed`, `student-confirmed`), or remove invalid items before confirmation.

* **Request Body**:
```json
{
  "skills": [
    {
      "name": "Node.js",
      "status": "demonstrated",
      "evidence": "Built REST APIs in Node.js and Express for university portal",
      "sourceReference": "Built REST APIs in Node.js and Express",
      "verified": true
    },
    {
      "name": "PostgreSQL",
      "status": "student-confirmed",
      "evidence": "Self-taught and used in hackathons",
      "sourceReference": null,
      "verified": true
    }
  ]
}
```

* **Response `200 OK`**:
```json
{
  "profileId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "status": "draft",
  "skills": [ ... ],
  "updatedAt": "2026-10-24T12:02:15.000Z"
}
```

* **Error `400 Bad Request`**: If profile is already `confirmed`.

---

### 3.4 `POST /api/profile/:id/confirm`
Locks the student profile into `confirmed` status. Subsequent match and draft calls are unlocked.

* **Request**: Empty body `{}`
* **Response `200 OK`**:
```json
{
  "profileId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "status": "confirmed",
  "confirmedAt": "2026-10-24T12:03:00.000Z"
}
```

---

### 3.5 `POST /api/opportunities/match`
Ranks the 5 fictitious internship opportunities.
* **Pre-condition**: `profileId` must have `status: "confirmed"`. If draft, returns `HTTP 400 UNCONFIRMED_PROFILE`.
* **Execution**: Model executes bounded loop with `search_and_score_opportunities` exposed. Server injects confirmed profile; code scores deterministically; model returns explanations citing CV & Opportunity IDs.

* **Request Body**:
```json
{
  "profileId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

* **Response `200 OK`**:
```json
{
  "profileId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "matches": [
    {
      "opportunityId": "opp-backend-intern",
      "title": "Junior Backend Engineering Intern",
      "company": "DataStream Tech",
      "score": 82,
      "matchBreakdown": {
        "matchedRequired": ["Node.js", "PostgreSQL"],
        "matchedPreferred": ["Express"],
        "missingRequired": [],
        "missingPreferred": ["Redis", "Docker"]
      },
      "explanation": {
        "summary": "Strong core match for backend fundamentals.",
        "strengths": "Demonstrated Node.js and PostgreSQL from university portal project directly address opp-backend-intern-req-1 and req-2.",
        "gaps": "Lacks Redis caching (opp-backend-intern-pref-1) and Docker containerization experience."
      }
    }
  ],
  "toolCalls": [
    {
      "tool": "search_and_score_opportunities",
      "invokedBy": "model",
      "timestamp": "2026-10-24T12:04:10.000Z"
    }
  ],
  "mock": false
}
```

---

### 3.6 `POST /api/plans/draft`
Drafts a 7-day development plan.
* **Pre-condition**: `profileId` must be `confirmed`.
* **Execution**: Model runs bounded loop with **only `find_learning_resources` exposed**. Model finds matching resources for skill gaps and drafts a 7-day activity plan ($\ge 3$ activities with real `resourceIds`).

* **Request Body**:
```json
{
  "profileId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "opportunityId": "opp-backend-intern"
}
```

* **Response `200 OK`**:
```json
{
  "status": "draft_generated",
  "opportunityId": "opp-backend-intern",
  "draftPlan": {
    "title": "7-Day Backend Growth & Gap Closure Plan",
    "targetRole": "Junior Backend Engineering Intern",
    "activities": [
      {
        "day": 1,
        "title": "Redis Caching Fundamentals",
        "description": "Read guide on Redis cache-aside patterns and set up local Redis instance.",
        "durationMinutes": 60,
        "resourceIds": ["res-redis-mastery"],
        "completionStatus": "pending"
      },
      {
        "day": 3,
        "title": "Containerizing Express & Postgres with Docker Compose",
        "description": "Create a multi-container Docker setup for local API development.",
        "durationMinutes": 90,
        "resourceIds": ["res-docker-essentials"],
        "completionStatus": "pending"
      },
      {
        "day": 6,
        "title": "Backend System Design & Mock Interview",
        "description": "Review system design questions and test scenarios using the team review guide.",
        "durationMinutes": 60,
        "resourceIds": ["res-interview-prep"],
        "completionStatus": "pending"
      }
    ]
  },
  "toolCalls": [
    {
      "tool": "find_learning_resources",
      "invokedBy": "model",
      "input": { "skillGaps": ["Redis", "Docker"] },
      "resultCount": 2,
      "timestamp": "2026-10-24T12:05:01.000Z"
    }
  ],
  "mock": false
}
```

---

### 3.7 `POST /api/plans/confirm`
Explicit student confirmation to save the plan.
* **Validation**:
  1. Profile must exist and be `confirmed`.
  2. Opportunity ID must exist in static opportunities list.
  3. Plan must have $\ge 3$ activities across valid days (1–7).
  4. All referenced `resourceIds` must exist in static team resources.
  5. Durations must be valid positive integers (15–300 minutes).
* **Execution**: Server calls internal `save_development_plan` with server-derived `studentConfirmed: true`. Saves snapshot of profile. Logs tool call.

* **Request Body**:
```json
{
  "profileId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "opportunityId": "opp-backend-intern",
  "plan": {
    "title": "7-Day Backend Growth & Gap Closure Plan",
    "activities": [
      {
        "day": 1,
        "title": "Redis Caching Fundamentals",
        "description": "Read guide on Redis cache-aside patterns and set up local Redis instance.",
        "durationMinutes": 60,
        "resourceIds": ["res-redis-mastery"],
        "completionStatus": "pending"
      },
      {
        "day": 3,
        "title": "Containerizing Express & Postgres with Docker Compose",
        "description": "Create a multi-container Docker setup for local API development.",
        "durationMinutes": 90,
        "resourceIds": ["res-docker-essentials"],
        "completionStatus": "pending"
      },
      {
        "day": 6,
        "title": "Backend System Design & Mock Interview",
        "description": "Review system design questions and test scenarios using the team review guide.",
        "durationMinutes": 60,
        "resourceIds": ["res-interview-prep"],
        "completionStatus": "pending"
      }
    ]
  }
}
```

* **Response `201 Created`**:
```json
{
  "success": true,
  "planId": "e2a3c714-25bf-4099-a35f-d227b9efb718",
  "createdAt": "2026-10-24T12:06:30.000Z",
  "toolLog": [
    {
      "tool": "save_development_plan",
      "invokedBy": "server",
      "studentConfirmed": true,
      "status": "COMMITTED",
      "planId": "e2a3c714-25bf-4099-a35f-d227b9efb718",
      "timestamp": "2026-10-24T12:06:30.000Z"
    }
  ]
}
```

---

### 3.8 `GET /api/plans`
Lists all saved plans with opportunity information and profile snapshot metadata.

* **Request**: None
* **Response `200 OK`**:
```json
{
  "plans": [
    {
      "id": "e2a3c714-25bf-4099-a35f-d227b9efb718",
      "opportunityId": "opp-backend-intern",
      "title": "7-Day Backend Growth & Gap Closure Plan",
      "activitiesCount": 3,
      "profileSnapshot": {
        "profileId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        "confirmedSkillsCount": 4
      },
      "createdAt": "2026-10-24T12:06:30.000Z"
    }
  ]
}
```

---

### 3.9 `GET /api/plans/:id`
Retrieves a single saved plan by ID with full profile snapshot and activities JSONB.

* **Request**: Path param `:id` (UUID)
* **Response `200 OK`**:
```json
{
  "id": "e2a3c714-25bf-4099-a35f-d227b9efb718",
  "opportunityId": "opp-backend-intern",
  "title": "7-Day Backend Growth & Gap Closure Plan",
  "profileSnapshot": {
    "profileId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "skills": [ ... ]
  },
  "activities": [
    {
      "day": 1,
      "title": "Redis Caching Fundamentals",
      "description": "Read guide on Redis cache-aside patterns and set up local Redis instance.",
      "durationMinutes": 60,
      "resourceIds": ["res-redis-mastery"],
      "completionStatus": "pending"
    },
    {
      "day": 3,
      "title": "Containerizing Express & Postgres with Docker Compose",
      "description": "Create a multi-container Docker setup for local API development.",
      "durationMinutes": 90,
      "resourceIds": ["res-docker-essentials"],
      "completionStatus": "pending"
    },
    {
      "day": 6,
      "title": "Backend System Design & Mock Interview",
      "description": "Review system design questions and test scenarios using the team review guide.",
      "durationMinutes": 60,
      "resourceIds": ["res-interview-prep"],
      "completionStatus": "completed"
    }
  ],
  "createdAt": "2026-10-24T12:06:30.000Z",
  "updatedAt": "2026-10-24T12:15:00.000Z"
}
```

---

### 3.10 `PATCH /api/plans/:id/activities/:day`
Updates the completion status of a specific day's activity within the stored plan JSONB.

* **Path Parameters**:
  - `:id` (UUID)
  - `:day` (Integer 1–7)
* **Request Body**:
```json
{
  "completionStatus": "completed"
}
```
*(Permitted values: `"pending"`, `"in_progress"`, `"completed"`, `"skipped"`)*

* **Response `200 OK`**:
```json
{
  "planId": "e2a3c714-25bf-4099-a35f-d227b9efb718",
  "day": 1,
  "completionStatus": "completed",
  "updatedAt": "2026-10-24T12:16:00.000Z"
}
```
