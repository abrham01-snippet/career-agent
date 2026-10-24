# Deterministic Scoring Specification

This document details the pure deterministic scoring function used by the AI Career Development Agent to score and rank internship opportunities against a confirmed student skill profile.

**Key Invariant**: Scoring is 100% deterministic code (JavaScript). The AI model never generates, calculates, or modifies match scores. Skill aliases (e.g. `postgres` $\rightarrow$ `SQL`, `js` $\rightarrow$ `JavaScript`) are a deliberate simplification to handle synonymous CV terminology deterministically without requiring an LLM or taxonomy engine.

---

## 1. Skill Credit Values

Each skill established in the student profile is assigned a credit weight based on its evidentiary status:

| Status | Credit Weight | Classification | Description |
| :--- | :---: | :---: | :--- |
| `demonstrated` | **1.0** | Full Match | Skill backed by concrete project or work experience verified against CV text. |
| `student_confirmed` | **1.0** | Full Match | Skill confirmed or added directly by the student during profile review. |
| `listed` | **0.5** | Partial Match | Skill listed in CV (e.g. skills header) without project/impact evidence. |
| `not_established` | **0.0** | Missing | Skill is absent from CV or unverified. |

*Note: Any skill not present in the student's profile defaults to `not_established` (credit `0.0`).*

---

## 2. Match Classification Categories

Each scored opportunity separates matched skills into three distinct buckets for required and preferred requirements:
* **Full Matches (`matchedRequired`, `matchedPreferred`)**: Skills with credit strictly equal to $1.0$ (`demonstrated` or `student_confirmed`).
* **Partial Matches (`partialRequired`, `partialPreferred`)**: Skills with credit strictly between $0.0$ and $1.0$ (e.g. `listed` with credit $0.5$).
* **Missing Skills (`missingRequired`, `missingPreferred`)**: Skills with credit equal to $0.0$ (`not_established` or absent).

---

## 3. Mathematical Scoring Formula

Each opportunity defines two sets of skills:
1. **Required Skills** ($R$): Essential prerequisites for the role ($|R| = \text{count of required skills}$).
2. **Preferred Skills** ($P$): Nice-to-have capabilities ($|P| = \text{count of preferred skills}$).

### 3.1 Component Fractions

* **Required Skills Fraction ($F_{\text{req}}$)**:
  $$F_{\text{req}} = \frac{\sum_{s \in R} \text{Credit}(s)}{|R|}$$

* **Preferred Skills Fraction ($F_{\text{pref}}$)**:
  $$F_{\text{pref}} = \begin{cases} \frac{\sum_{s \in P} \text{Credit}(s)}{|P|}, & \text{if } |P| > 0 \\ 0, & \text{if } |P| = 0 \end{cases}$$

### 3.2 Combined Opportunity Score

When preferred skills exist ($|P| > 0$), the score is an 80/20 weighted combination:
$$\text{RawScore} = 100 \times \left( 0.8 \times F_{\text{req}} + 0.2 \times F_{\text{pref}} \right)$$

When no preferred skills exist ($|P| = 0$):
$$\text{RawScore} = 100 \times F_{\text{req}}$$

### 3.3 Rounding & Score Bounds
* Scores are strictly bounded between $0$ and $100$.
* The integer score presented to the student is computed using standard half-up rounding:
  $$\text{Score} = \text{Math.round}(\text{RawScore})$$
* The service retains both `rawScore` (for precise sorting) and `score` (rounded integer).

### 3.4 Tie-Breaking Rule
When two opportunities have identical `rawScore` values, ties are broken deterministically by sorting alphabetically by Opportunity ID ascending (`id.localeCompare(other.id)`).

---

## 4. Five Demonstration Opportunity Records

| ID | Title | Required Skills ($R$) | Preferred Skills ($P$) |
| :--- | :--- | :--- | :--- |
| **OPP001** | Junior Data Analyst Intern | Python, SQL, Excel | Data visualization |
| **OPP002** | Junior Web Developer Intern | HTML, CSS, JavaScript | Git |
| **OPP003** | Python Development Trainee | Python, Git, API basics | Testing fundamentals |
| **OPP004** | Software Testing Intern | Testing fundamentals, Python | Git |
| **OPP005** | IT Support Intern | Troubleshooting, Networking basics | Communication |

---

## 5. Worked Numerical Examples (Oracle Hand Calculations)

### Scenario A: Baseline Student Profile
**Profile Skills**:
* Python: `demonstrated` ($1.0$)
* SQL: `demonstrated` ($1.0$)
* HTML: `demonstrated` ($1.0$)
* CSS: `demonstrated` ($1.0$)
* Excel: `listed` ($0.5$)

#### Evaluation:
* **OPP001 (Junior Data Analyst Intern)**:
  * $R = \{\text{Python}(1.0), \text{SQL}(1.0), \text{Excel}(0.5)\} \rightarrow \sum = 2.5$. $F_{\text{req}} = 2.5 / 3 = 0.8333...$
  * $P = \{\text{Data visualization}(0.0)\} \rightarrow \sum = 0.0$. $F_{\text{pref}} = 0.0 / 1 = 0.0$
  * $\text{RawScore} = 100 \times (0.8 \times \frac{2.5}{3} + 0.2 \times 0.0) = 66.6667 \rightarrow$ **Score = 67**
  * Full Matches: `matchedRequired` = `['Python', 'SQL']`
  * Partial Matches: `partialRequired` = `['Excel']`
  * Missing: `missingPreferred` = `['Data visualization']`
* **OPP002 (Junior Web Developer Intern)**:
  * $R = \{\text{HTML}(1.0), \text{CSS}(1.0), \text{JavaScript}(0.0)\} \rightarrow \sum = 2.0$. $F_{\text{req}} = 2.0 / 3 = 0.6667...$
  * $P = \{\text{Git}(0.0)\} \rightarrow \sum = 0.0$. $F_{\text{pref}} = 0.0$
  * $\text{RawScore} = 100 \times (0.8 \times \frac{2.0}{3} + 0.2 \times 0.0) = 53.3333 \rightarrow$ **Score = 53**
* **OPP004 (Software Testing Intern)**:
  * $R = \{\text{Testing fundamentals}(0.0), \text{Python}(1.0)\} \rightarrow \sum = 1.0$. $F_{\text{req}} = 1.0 / 2 = 0.5$
  * $P = \{\text{Git}(0.0)\} \rightarrow \sum = 0.0$. $F_{\text{pref}} = 0.0$
  * $\text{RawScore} = 100 \times (0.8 \times 0.5 + 0.2 \times 0.0) = 40.0 \rightarrow$ **Score = 40**
* **OPP003 (Python Development Trainee)**:
  * $R = \{\text{Python}(1.0), \text{Git}(0.0), \text{API basics}(0.0)\} \rightarrow \sum = 1.0$. $F_{\text{req}} = 1.0 / 3 = 0.3333...$
  * $P = \{\text{Testing fundamentals}(0.0)\} \rightarrow \sum = 0.0$. $F_{\text{pref}} = 0.0$
  * $\text{RawScore} = 100 \times (0.8 \times \frac{1.0}{3} + 0.2 \times 0.0) = 26.6667 \rightarrow$ **Score = 27**
* **OPP005 (IT Support Intern)**:
  * $R = \{\text{Troubleshooting}(0.0), \text{Networking basics}(0.0)\} \rightarrow F_{\text{req}} = 0.0$
  * $P = \{\text{Communication}(0.0)\} \rightarrow F_{\text{pref}} = 0.0$
  * $\text{RawScore} = 0.0 \rightarrow$ **Score = 0**

**Ranked Order**: OPP001 (67), OPP002 (53), OPP004 (40), OPP003 (27), OPP005 (0).

---

### Scenario B: Adding Student-Confirmed Skills
When the student explicitly confirms **Git** (`student_confirmed`, credit $1.0$) and upgrades **Excel** (`student_confirmed`, credit $1.0$):

* **OPP001**: $R = \{\text{Python}(1.0), \text{SQL}(1.0), \text{Excel}(1.0)\} \rightarrow$ **Score = 80**
* **OPP002**: $R = \{\text{HTML}(1.0), \text{CSS}(1.0), \text{JavaScript}(0.0)\}, P = \{\text{Git}(1.0)\} \rightarrow$ **Score = 73**
* **OPP004**: $R = \{\text{Testing fundamentals}(0.0), \text{Python}(1.0)\}, P = \{\text{Git}(1.0)\} \rightarrow$ **Score = 60**
* **OPP003**: $R = \{\text{Python}(1.0), \text{Git}(1.0), \text{API basics}(0.0)\} \rightarrow$ **Score = 53**
* **OPP005**: $\text{RawScore} = 0.0 \rightarrow$ **Score = 0**

**Ranked Order**: OPP001 (80), OPP002 (73), OPP004 (60), OPP003 (53), OPP005 (0).
*(Note: If only Git is confirmed prior to confirming Excel, OPP002 jumps to 73 over OPP001's 67, temporarily flipping the #1 ranked opportunity).*
