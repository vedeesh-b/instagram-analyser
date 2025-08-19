import tempfile
import zipfile
import os
import sqlite3
import json
import shutil

def zip_parser(zip_path: str, db_path: str) -> str:
    temp_dir = tempfile.mkdtemp()

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(temp_dir)

    os.makedirs(os.path.dirname(db_path), exist_ok=True)
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

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS messages (       
                sender TEXT,                  
                timestamp INTEGER,            
                text TEXT,                    
                has_media INTEGER DEFAULT 0,
                UNIQUE(sender, timestamp)   
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS location_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile_based_in TEXT,
            imprecise_latitude REAL,
            imprecise_longitude REAL,
            precise_latitude REAL,
            precise_longitude REAL,
            UNIQUE(profile_based_in, imprecise_latitude, imprecise_longitude, precise_latitude, precise_longitude)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS locations_of_interest (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location_id INTEGER,
            place TEXT,
            FOREIGN KEY (location_id) REFERENCES locations (id),
            UNIQUE(location_id, place)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS story_locations (
            latitude REAL,
            longitude REAL,
            timestamp INTEGER,
            title TEXT,
            UNIQUE(latitude, longitude, timestamp, title)
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

    def fix_mojibake(s):
        if isinstance(s, str):
            try:
                return s.encode("latin1").decode("utf-8")
            except UnicodeEncodeError:
                return s
            except UnicodeDecodeError:
                return s
        return s

    inbox_path = os.path.join(temp_dir, 'your_instagram_activity/messages/inbox')
    messages = os.listdir(inbox_path)
    for conversation in messages:
        convo_path = os.path.join(inbox_path, conversation)
        if not os.path.isdir(convo_path):
            continue

        for message_file in os.listdir(convo_path):
            if message_file.startswith('message') and message_file.endswith('.json'):
                json_path = os.path.join(convo_path, message_file)

                with open(json_path, 'r', encoding='utf-8') as convo_file:
                    data = json.load(convo_file)

                    for msg in data.get('messages', []):
                        sender = fix_mojibake(msg.get('sender_name'))
                        timestamp = msg.get('timestamp_ms')
                        content = msg.get('content')
                        has_media = 1 if ('photos' in msg or 'share' in msg or 'video' in msg or 'audio_files' in msg) else 0

                        cursor.execute("""
                            INSERT OR IGNORE INTO messages (sender, timestamp, text, has_media)
                            VALUES (?, ?, ?, ?)
                        """, (sender, timestamp, content, has_media))

    profile_based_in_path = os.path.join(temp_dir, 'personal_information/information_about_you/profile_based_in.json')
    locations_of_interest_path = os.path.join(temp_dir, 'personal_information/information_about_you/locations_of_interest.json')
    location_permissions_path = os.path.join(temp_dir, 'security_and_login_information/login_and_profile_creation/last_known_location.json')
    
    location_data = {}
    if os.path.exists(profile_based_in_path):
        with open(profile_based_in_path, 'r', encoding='utf-8') as profile_base:
            profile_based_in_data = json.load(profile_base)
            location_data['profile_based_in'] = profile_based_in_data.get('inferred_data_primary_location')[0].get('string_map_data').get('City Name').get('value')
    
    if os.path.exists(locations_of_interest_path):
        with open(locations_of_interest_path, 'r', encoding='utf-8') as locations_of_interest:
            locations_of_interest_data = json.load(locations_of_interest)
            location_data['locations_of_interest'] = [item['value'] for item in locations_of_interest_data.get('label_values')[0].get('vec') if 'value' in item]

    if os.path.exists(location_permissions_path):
        with open(location_permissions_path, 'r', encoding='utf-8') as permissions:
            permissions_data = json.load(permissions)
            data_dict = permissions_data.get('account_history_imprecise_last_known_location')[0].get('string_map_data')
            location_data['location_permissions'] = {key.lower().replace(" ", "_"): val.get('value') for key, val in data_dict.items() if 'gps' not in key.lower()}

    cursor.execute("""
        INSERT OR IGNORE INTO location_data (profile_based_in, imprecise_latitude, imprecise_longitude, precise_latitude, precise_longitude)
        VALUES (?, ?, ?, ?, ?)
    """, (
        location_data['profile_based_in'],
        float(location_data['location_permissions']['imprecise_latitude']),
        float(location_data['location_permissions']['imprecise_longitude']),
        float(location_data['location_permissions']['precise_latitude']),
        float(location_data['location_permissions']['precise_longitude'])
    ))

    cursor.execute("""
        SELECT id FROM location_data
        WHERE profile_based_in = ? 
        AND imprecise_latitude = ? 
        AND imprecise_longitude = ? 
        AND precise_latitude = ? 
        AND precise_longitude = ?
    """, (
        location_data['profile_based_in'],
        float(location_data['location_permissions']['imprecise_latitude']),
        float(location_data['location_permissions']['imprecise_longitude']),
        float(location_data['location_permissions']['precise_latitude']),
        float(location_data['location_permissions']['precise_longitude'])
    ))

    row = cursor.fetchone()
    location_id = row[0] if row else None

    for place in location_data['locations_of_interest']:
        cursor.execute("INSERT OR IGNORE INTO locations_of_interest (location_id, place) VALUES (?, ?)", (location_id, place))

    story_locations_path = os.path.join(temp_dir, 'your_instagram_activity/media/stories.json')
    if os.path.exists(story_locations_path):
        with open(story_locations_path, 'r', encoding="utf-8") as story_locations:
            stories_json = json.load(story_locations)
            story_data = stories_json.get('ig_stories', [])
            for story in story_data:
                timestamp = story.get('creation_timestamp')
                title = story.get('title', '')

                latitude, longitude = '', ''

                media_metadata = story.get('media_metadata', {})

                if 'photo_metadata' in media_metadata:
                    exif_data = media_metadata.get('photo_metadata', {}).get('exif_data', [])
                else:
                    exif_data = media_metadata.get('video_metadata', {}).get('exif_data', [])

                for exif in exif_data:
                    if 'latitude' in exif and 'longitude' in exif:
                        latitude = exif.get('latitude', '')
                        longitude = exif.get('longitude', '')
                        break 

                cursor.execute("""
                    INSERT OR IGNORE INTO story_locations (latitude, longitude, timestamp, title)
                    VALUES (?, ?, ?, ?)
                """, (latitude, longitude, timestamp, title))

    conn.commit()
    conn.close()

    shutil.rmtree(temp_dir)

    return db_path