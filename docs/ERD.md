# Dayflow ERD (Entity-Relationship Diagram)

## M3A.2 Approved Schema

### Entity-Relationship Diagram

```mermaid
erDiagram
    EXPENSES {
        id INTEGER [PK, AUTOINCREMENT]
        title TEXT NOT NULL
        amount INTEGER NOT NULL (centavos)
        category TEXT NOT NULL (enum)
        date TEXT NOT NULL (YYYY-MM-DD)
        created_at TEXT
        updated_at TEXT
    }
    SAVINGS_GOALS {
        id INTEGER [PK, AUTOINCREMENT]
        name TEXT NOT NULL
        target_amount INTEGER NOT NULL (centavos)
        current_amount INTEGER DEFAULT 0 (centavos)
        target_date TEXT
        created_at TEXT
        updated_at TEXT
    }
    TASKS {
        id INTEGER [PK, AUTOINCREMENT]
        title TEXT NOT NULL
        description TEXT
        due_date TEXT
        priority TEXT DEFAULT 'Medium' (enum: High/Medium/Low)
        completed BOOLEAN DEFAULT 0
        created_at TEXT
        updated_at TEXT
    }
    SCHEDULE_ACTIVITIES {
        id INTEGER [PK, AUTOINCREMENT]
        title TEXT NOT NULL
        start_time TEXT
        end_time TEXT
        date TEXT (YYYY-MM-DD)
        created_at TEXT
        updated_at TEXT
    }
    APPLICATION_PREFERENCES {
        key TEXT [PK]
        value TEXT NOT NULL
        updated_at TEXT
    }
    ACTIVITY_LOG {
        id INTEGER [PK, AUTOINCREMENT]
        type TEXT NOT NULL (expense | savings | task)
        title TEXT NOT NULL
        timestamp TEXT NOT NULL (ISO format)
        related_id INTEGER
        activity_date TEXT
    }
```

### Relationship Details

```
EXPENSES ||--o{ ACTIVITY_LOG : logs
SAVINGS_GOALS ||--o{ ACTIVITY_LOG : logs
TASKS ||--o{ ACTIVITY_LOG : logs
APPLICATION_PREFERENCES }o--o{ ACTIVITY_LOG : logs
```

### Table Overviews

**expenses:**
- Stores expense records for Wallet functionality
- Amount in centavos (INTEGER)
- Category enum: 'Food & Drinks', 'Transport', 'Others'
- Date: YYYY-MM-DD

**savings_goals:**
- Stores savings goals for Savings functionality
- target_amount and current_amount in centavos (INTEGER)
- target_date: YYYY-MM-DD (optional)

**tasks:**
- Stores task records for Tasks functionality
- priority enum: 'High', 'Medium', 'Low'
- completed: boolean (0/1)
- due_date: YYYY-MM-DD

**schedule_activities:**
- Stores one-time scheduled activities only
- No recurrence support (M3B scope)
- date: YYYY-MM-DD

**application_preferences:**
- Key-value store for app settings
- Keys: 'theme_color', 'font_family', 'notifications_enabled', 'app_version'
- Values: TEXT

**activity_log:**
- Aggregated log of recent activities from all modules
- type: 'expense' | 'savings' | 'task'
- related_id: references id from source tables
- activity_date: YYYY-MM-DD for retention/organization

### Visual ERD (Mermaid Diagram)

```mermaid
erDiagram
    EXPENSES ||--o{ ACTIVITY_LOG : logs
    SAVINGS_GOALS ||--o{ ACTIVITY_LOG : logs
    TASKS ||--o{ ACTIVITY_LOG : logs
    APPLICATION_PREFERENCES }o--o{ ACTIVITY_LOG : logs
    
    EXPENSES {
        id INTEGER PK AUTOINCREMENT
        amount INTEGER (centavos)
        category TEXT (enum: Food & Drinks, Transport, Others)
        date TEXT (YYYY-MM-DD)
    }
    
    SAVINGS_GOALS {
        id INTEGER PK AUTOINCREMENT
        target_amount INTEGER (centavos)
        current_amount INTEGER DEFAULT 0 (centavos)
        target_date TEXT
    }
    
    TASKS {
        id INTEGER PK AUTOINCREMENT
        priority TEXT (enum: High/Medium/Low)
        completed BOOLEAN DEFAULT 0
        due_date TEXT
    }
    
    SCHEDULE_ACTIVITIES {
        id INTEGER PK AUTOINCREMENT
        date TEXT (YYYY-MM-DD)
        -- No recurrence columns (M3B scope)
    }
    
    APPLICATION_PREFERENCES {
        key TEXT PK
        value TEXT
        -- Keys: theme_color, font_family, notifications_enabled, app_version
    }
    
    ACTIVITY_LOG {
        id INTEGER PK AUTOINCREMENT
        type TEXT (expense | savings | task)
        title TEXT NOT NULL
        timestamp ISO format
        related_id INTEGER
        activity_date TEXT
    }
```
