import imaplib
import sys

def connect_gmail(user, password):
    """
    Establish a secure IMAP connection to Gmail.
    """
    try:
        print(f"Connecting to IMAP server as {user}...")
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(user, password)
        print("Successfully authenticated with Gmail.")
        return mail
    except Exception as e:
        print(f"Authentication failed: {e}")
        return None

def disconnect_gmail(mail):
    """
    Close the IMAP connection.
    """
    if mail:
        try:
            mail.close()
            mail.logout()
            print("IMAP connection closed securely.")
        except Exception as e:
            print(f"Error during logout: {e}")
