use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create users table",
            sql: "
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    username TEXT,
                    email TEXT UNIQUE,
                    email_verified DATETIME,
                    password TEXT,
                    image TEXT,
                    active INTEGER CHECK(active IN (0, 1)) DEFAULT 0,
                    role TEXT CHECK(role IN ('ADMIN', 'SUPERUSER', 'USER')) DEFAULT 'USER',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create accounts table",
            sql: "
                CREATE TABLE IF NOT EXISTS accounts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    type TEXT NOT NULL,
                    provider TEXT NOT NULL,
                    provider_account_id TEXT NOT NULL,
                    refresh_token TEXT,
                    access_token TEXT,
                    expires_at INTEGER,
                    token_type TEXT,
                    scope TEXT,
                    id_token TEXT,
                    session_state TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                    UNIQUE (provider, provider_account_id)
                );
                CREATE INDEX idx_accounts_user_id ON accounts (user_id);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create verification_tokens table",
            sql: "
                CREATE TABLE IF NOT EXISTS verification_tokens (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL,
                    token TEXT NOT NULL UNIQUE,
                    expires DATETIME NOT NULL,
                    UNIQUE (email, token)
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create password_reset_tokens table",
            sql: "
                CREATE TABLE IF NOT EXISTS password_reset_tokens (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL,
                    token TEXT NOT NULL UNIQUE,
                    expires DATETIME NOT NULL,
                    UNIQUE (email, token)
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "create boards table",
            sql: "
                CREATE TABLE IF NOT EXISTS boards (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    author_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    image_id TEXT,
                    image_thumb TEXT,
                    image_full_url TEXT,
                    image_user_name TEXT,
                    image_link_html TEXT,
                    color TEXT,
                    list_order TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
                );
                CREATE INDEX idx_boards_author_id ON boards (author_id);
                CREATE INDEX idx_boards_title ON boards (title);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "create lists table",
            sql: "
                CREATE TABLE IF NOT EXISTS lists (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    color TEXT,
                    board_id INTEGER NOT NULL,
                    card_order TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (board_id) REFERENCES boards (id) ON DELETE CASCADE
                );
                CREATE INDEX idx_lists_board_id ON lists (board_id);
                CREATE INDEX idx_lists_title ON lists (title);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "create cards table",
            sql: "
                CREATE TABLE IF NOT EXISTS cards (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    description TEXT,
                    list_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
                );
                CREATE INDEX idx_cards_list_id ON cards (list_id);
                CREATE INDEX idx_cards_title ON cards (title);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 8,
            description: "create checklists table",
            sql: "
                CREATE TABLE IF NOT EXISTS checklists (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT NOT NULL,
                    checked INTEGER DEFAULT 0,
                    card_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (card_id) REFERENCES cards (id) ON DELETE CASCADE
                );
                CREATE INDEX idx_checklists_card_id ON checklists (card_id);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 9,
            description: "create author_activities table",
            sql: "
                CREATE TABLE IF NOT EXISTS author_activities (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    author_id INTEGER NOT NULL,
                    activity TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE (author_id, created_at),
                    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 10,
            description: "create books table",
            sql: "
                CREATE TABLE IF NOT EXISTS books (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    overview TEXT,
                    cover TEXT,
                    banner TEXT,
                    chapters_order TEXT,
                    characters_order TEXT,
                    locations_order TEXT,
                    author_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
                );
                CREATE INDEX idx_books_author_id ON books (author_id);
                CREATE INDEX idx_books_title ON books (title);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 11,
            description: "create chapters table",
            sql: "
                CREATE TABLE IF NOT EXISTS chapters (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    book_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
                );
                CREATE INDEX idx_chapters_book_id ON chapters (book_id);
                CREATE INDEX idx_chapters_title ON chapters (title);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 12,
            description: "create chapter_contents table",
            sql: "
                CREATE TABLE IF NOT EXISTS chapter_contents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    version TEXT NOT NULL,
                    slug TEXT NOT NULL,
                    content_html TEXT,
                    content_text TEXT,
                    word_count INTEGER DEFAULT 0,
                    color TEXT,
                    chapter_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (chapter_id) REFERENCES chapters (id) ON DELETE CASCADE,
                    UNIQUE (chapter_id, slug)
                );
                CREATE INDEX idx_chapter_contents_chapter_id ON chapter_contents (chapter_id);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 13,
            description: "create highlights table",
            sql: "
                CREATE TABLE IF NOT EXISTS highlights (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    text TEXT NOT NULL,
                    start_position INTEGER NOT NULL,
                    end_position INTEGER NOT NULL,
                    color TEXT,
                    chapter_content_id INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (chapter_content_id) REFERENCES chapter_contents (id)
                );
                CREATE INDEX idx_highlights_chapter_content_id ON highlights (chapter_content_id);
                CREATE INDEX idx_highlights_start_position_end_position ON highlights (start_position, end_position);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 14,
            description: "create characters table",
            sql: "
                CREATE TABLE IF NOT EXISTS characters (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    image TEXT,
                    role TEXT CHECK(role IN ('UNSPECIFIED', 'MAIN', 'SECONDARY', 'MINOR')) DEFAULT 'UNSPECIFIED',
                    book_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
                );
                CREATE INDEX idx_characters_book_id ON characters (book_id);
                CREATE INDEX idx_characters_name ON characters (name);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 15,
            description: "create relationships table",
            sql: "
                CREATE TABLE IF NOT EXISTS relationships (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    relation_a_b TEXT NOT NULL,
                    relation_b_a TEXT NOT NULL,
                    character_a_id INTEGER NOT NULL,
                    character_b_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (character_a_id) REFERENCES characters (id) ON DELETE CASCADE,
                    FOREIGN KEY (character_b_id) REFERENCES characters (id) ON DELETE CASCADE
                );
                CREATE INDEX idx_relationships_character_a_id ON relationships (character_a_id);
                CREATE INDEX idx_relationships_character_b_id ON relationships (character_b_id);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 16,
            description: "create locations table",
            sql: "
                CREATE TABLE IF NOT EXISTS locations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    image TEXT,
                    book_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
                );
                CREATE INDEX idx_locations_book_id ON locations (book_id);
                CREATE INDEX idx_locations_name ON locations (name);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 17,
            description: "create column_aspects table",
            sql: "
                CREATE TABLE IF NOT EXISTS column_aspects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT,
                    character_id INTEGER,
                    location_id INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE,
                    FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
                );
                CREATE INDEX idx_column_aspects_character_id ON column_aspects (character_id);
                CREATE INDEX idx_column_aspects_location_id ON column_aspects (location_id);
                CREATE INDEX idx_column_aspects_title ON column_aspects (title);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 18,
            description: "create aspects table",
            sql: "
                CREATE TABLE IF NOT EXISTS aspects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    type TEXT CHECK(type IN ('HEADING', 'DESCRIPTION', 'TEXT', 'LABELED', 'IMAGE', 'GALLERY', 'RELATIONSHIPS')),
                    title TEXT NOT NULL,
                    content TEXT,
                    collapsed INTEGER DEFAULT 0,
                    column_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (column_id) REFERENCES column_aspects (id) ON DELETE CASCADE
                );
                CREATE INDEX idx_aspects_column_id ON aspects (column_id);
                CREATE INDEX idx_aspects_title ON aspects (title);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 19,
            description: "create plots table",
            sql: "
                CREATE TABLE IF NOT EXISTS plots (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    flow_json TEXT,
                    book_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
                );
                CREATE INDEX idx_plots_book_id ON plots (book_id);
                CREATE INDEX idx_plots_name ON plots (name);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 20,
            description: "create notes table",
            sql: "
                CREATE TABLE IF NOT EXISTS notes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    content TEXT,
                    author_id INTEGER NOT NULL,
                    book_id INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
                    FOREIGN KEY (book_id) REFERENCES books (id)
                );
                CREATE INDEX idx_notes_author_id ON notes (author_id);
                CREATE INDEX idx_notes_book_id ON notes (book_id);
                CREATE INDEX idx_notes_title ON notes (title);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 21,
            description: "create book_settings table",
            sql: "
                CREATE TABLE IF NOT EXISTS book_settings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    book_id INTEGER NOT NULL UNIQUE,
                    font_family TEXT NOT NULL,
                    font_size TEXT NOT NULL,
                    content_width TEXT NOT NULL,
                    toolbar TEXT NOT NULL,
                    save_delay INTEGER,
                    FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
                );
            ",
            kind: MigrationKind::Up,
        },
    ]
}