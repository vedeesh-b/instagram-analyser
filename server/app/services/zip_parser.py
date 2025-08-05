import tempfile
import zipfile
import os
import sqlite3
import json

def zip_parser(zip_path: str) -> str:
    temp_dir = tempfile.mkdtemp()

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(temp_dir)

    db_path = os.path.join(tempfile.gettempdir(), 'temp_instagram.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS followers (
                   username TEXT,
                   link TEXT,
                   timestamp DATETIME,
                   UNIQUE(username, timestamp)
    )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS following (
                   username TEXT,
                   link TEXT,
                   timestamp DATETIME,
                   UNIQUE(username, timestamp)
        )
    """)

    followers_path = os.path.join(temp_dir, "connections/followers_and_following/followers_1.json")
    if os.path.exists(followers_path):
        with open(followers_path, 'r', encoding='utf-8') as f:
            followers = json.load(f)
            for follower in followers:
                string_data = follower.get("string_list_data", [{}])[0]
                username = string_data.get('value')
                link = string_data.get('href')
                timestamp = string_data.get('timestamp')

                cursor.execute(
                    "INSERT OR IGNORE INTO followers (username, link, timestamp) VALUES (?, ?, ?)",
                    (username, link, timestamp)
                )

    following_path = os.path.join(temp_dir, "connections/followers_and_following/following.json")
    if os.path.exists(following_path):
        with open(following_path, 'r', encoding='utf-8') as f:
            followings = json.load(f)
            for following in followings.get('relationships_following', []):
                string_data = following.get("string_list_data", [{}])[0]
                username = string_data.get('value')
                link = string_data.get('href')
                timestamp = string_data.get('timestamp')

                cursor.execute(
                    "INSERT OR IGNORE INTO following (username, link, timestamp) VALUES (?, ?, ?)",
                    (username, link, timestamp)
                )

    cursor.execute("""
        SELECT f.username
        FROM following f
        LEFT JOIN followers fl ON f.username = fl.username
        WHERE fl.username IS NULL
    """)
    non_followers = cursor.fetchall()
    print('non followers')
    for user in non_followers:
        print(user[0])

    conn.commit()
    conn.close()

    print(f'db path: ${db_path}')
    return db_path