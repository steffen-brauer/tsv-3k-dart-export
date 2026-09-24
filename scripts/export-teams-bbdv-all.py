import requests
import pandas as pd
import json


def get_leagues():

    leagues = []
    verband_url = "https://backend-ddv.3k-darts.com/2k-backend-ddv/api/v1/frontend/event/page?mandantKey=570&eventTypeCd=LEAGUE&regionId=17&seasonId=34"

    page = 0

    while True:
        url = f"{verband_url}&page={page}"
        response = requests.get(url)
        data = response.json()

        if not data.get("content"):
            break

        leagues.extend(data["content"])
        page += 1

    return leagues


def get_participants(league_id):

    participant_url = f"https://backend-ddv.3k-darts.com/2k-backend-ddv/api/v1/frontend/event/{league_id}/participant"
    response = requests.get(participant_url)
    data = response.json()
    return data


def get_team(team_id):
    
    team_url = f"https://backend-ddv.3k-darts.com/2k-backend-ddv/api/v1/frontend/participant/{team_id}?"

    response = requests.get(team_url)
    data = response.json()
    return data


# print(get_team(173280))
# exit()
# get_participants(1324)


# exit()


df = pd.DataFrame(columns=["Liga", "Team", "Spieler"])


for league in get_leagues():
    
    league_id = league.get("id")
    league_name = league.get("name")
    # if league_name == "Kreisliga 08":
    #     print(league)


    participants : list = []
    participants.extend(get_participants(league_id))
    
    for participant in participants:
#        print(json.dumps(participant, indent=4))
        participant_id = participant.get("id")
        participant_name = participant.get("team").get("name")

        team = get_team(participant_id)
        members = team["participant"]["teamSeason"]["teamMembers"]
        for member in members:
            df.loc[len(df)] = [league_name, participant_name, member.get('displayName')]



print(df.head(30))

df.to_excel("3k_leagues.xlsx", index=False)
df.to_json("data.json", orient="records", indent=4, force_ascii=False)