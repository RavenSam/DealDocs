use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create quotes table",
            sql: "
                CREATE TABLE IF NOT EXISTS quotes (
                    id TEXT PRIMARY KEY NOT NULL,
                    clientName TEXT NOT NULL,
                    clientEmail TEXT,
                    clientAddress TEXT,
                    note TEXT,
                    total_price TEXT,
                    steps_json TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            ",
            kind: MigrationKind::Up,
        },
 
    ]
}