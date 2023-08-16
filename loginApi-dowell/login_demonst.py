from login_api import LoginAPIClient

def main():
    base_url = "https://100014.pythonanywhere.com/api/loginapi"
    api_service_id = "DOWELL10004"
    api_key = "3f581771-b44a-472f-86b9-69f30b215fec"

    client = LoginAPIClient(base_url, api_service_id, api_key)

    username = "your_username"
    password = "your_password"
    time = "user_local_time"
    ip = "user_ip"
    os = "user_os"
    location = "latitude longitude"
    timezone = "Asia/Kolkata"

    print("Sending login request...")
    response = client.login(username, password, time, ip, os, location, timezone)

    print("Response:")
    print(response)

    if response:
        print("Login successful")
        print("Session ID:", client.session_id)
    else:
        print("Login failed")

if __name__ == "__main__":
    main()
