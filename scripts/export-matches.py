import requests
import json
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)

PARTICIPANT_BASE_URL="https://backend-ddv.3k-darts.com/2k-backend-ddv/api/v1/frontend/participant/"

HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "en-US,en;q=0.9,de;q=0.8",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Google Chrome";v="153", "Not_A Brand";v="8", "Chromium";v="153"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
}

teams = json.load(open("teams.json", "r"))

matches = []
    
for team in teams:
    url = f"{PARTICIPANT_BASE_URL}{team['id']}"
    response = requests.get(url, headers=HEADERS)

    response.raise_for_status()  # Raise an exception for HTTP errors
    data = response.json()
    data = data.get("matches", [])
    matches.extend(data)


matches_filtered = []

def format_date(date_str):
    dt = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%f%z")
    return dt.isoformat(timespec="milliseconds")


# extract relevant fields from matches
for match in matches:
    
    if match.get("participantHome") is None or match.get("participantGuest") is None:
        # spielfrei, skip this match
        continue

    match_filtered = {
        "id": match.get("id"),
        "participantHome": {
                "id": match.get("participantHome")["id"],
                "displayName": match.get("participantHome")["displayName"]
        },
        "participantAway": {
                "id": match.get("participantGuest")["id"],
                "displayName": match.get("participantGuest")["displayName"]
        },
        "event": {
            "id": match.get("event")["id"],
            "name": match.get("event")["name"]
        },
        "round": {
            "id": match.get("round")["id"],
            "name": match.get("round")["name"]
        },
        "datePlanned": format_date(match.get("datePlanned")),
        "status": match.get("statusCd"),
    }

    if match_filtered["status"] == "FINISH":
        match_filtered["result"] = f"{match.get('setsHome', '')}:{match.get('setsAway', '')} ({match.get('legsHome', '')}:{match.get('legsAway', '')})"
    else:
        match_filtered["result"] = "-"

    
    matches_filtered.append(match_filtered)

json.dump(matches_filtered, open("matches.json", "w"), indent=4)
logging.info(f"Exported {len(matches_filtered)} matches to matches.json")