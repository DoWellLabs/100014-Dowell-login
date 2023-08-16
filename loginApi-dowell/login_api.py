import requests

class LoginAPIClient:
    def __init__(self, base_url, api_service_id, api_key):
        self.base_url = base_url
        self.api_service_id = api_service_id
        self.api_key = api_key
        self.session_id = None

    def login(self, username, password, time, ip, os, location, timezone, language=None, browser='', device='api'):
        login_url = f"{self.base_url}/login"
        payload = {
            "api_service_id": self.api_service_id,
            "api_key": self.api_key,
            "username": username,
            "password": password,
            "time": time,
            "ip": ip,
            "os": os,
            "location": location,
            "timezone": timezone,
            "language": language,
            "browser": browser,
            "device": device
        }

        print("Sending login request with payload:")
        print(payload)

        response = requests.post(login_url, json=payload)

        print("Response status code:", response.status_code)
        print("Response content:", response.text)

        if response.status_code == 200:
            data = response.json()
            self.session_id = data.get("session_id")
            return data
        else:
            print("Login failed")
            return None

# Example usage
if __name__ == "__main__":
    base_url = "https://100014.pythonanywhere.com/api/loginapi"
    api_service_id = "DOWELL10004"
    api_key = "3f581771-b44a-472f-86b9-69f30b215fec"

    client = LoginAPIClient(base_url, api_service_id, api_key)

    username = "MrAchinDev"
    password = "ywCXEd@wGTnE7Nf"
    time = "2023-08-09T12:00:00"
    ip = "192.168.1.1"
    os = "Windows"
    location = "40.7128 -74.0060"
    timezone = "Asia/Kolkata"

    response = client.login(username, password, time, ip, os, location, timezone)

    if response:
        print("Login successful")
        print("Session ID:", client.session_id)
    else:
        print("Login failed")
