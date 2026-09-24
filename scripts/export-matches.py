import requests
import json
from datetime import datetime
urls = [
    "https://backend-ddv.3k-darts.com/2k-backend-ddv/api/v1/frontend/participant/173280", # A
    "https://backend-ddv.3k-darts.com/2k-backend-ddv/api/v1/frontend/participant/173376", # B
    "https://backend-ddv.3k-darts.com/2k-backend-ddv/api/v1/frontend/participant/173531", # C
    "https://backend-ddv.3k-darts.com/2k-backend-ddv/api/v1/frontend/participant/176507", # 1 (Pokal)
    "https://backend-ddv.3k-darts.com/2k-backend-ddv/api/v1/frontend/participant/176508", # 2 (Pokal)
    "https://backend-ddv.3k-darts.com/2k-backend-ddv/api/v1/frontend/participant/176509", # 3 (Pokal)
    "https://backend-ddv.3k-darts.com/2k-backend-ddv/api/v1/frontend/participant/174487" # NDV 8er
]

matches = []

for url in urls:
    response = requests.get(url)
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
