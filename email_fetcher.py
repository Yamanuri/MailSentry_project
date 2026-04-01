import email
from email.header import decode_header
import sys

def fetch_latest_emails(mail, n=50):
    """
    Fetch the latest $N$ emails from the inbox.
    """
    try:
        mail.select("inbox")
        status, messages = mail.search(None, "ALL")
        if status != "OK":
            print("No messages found in inbox.")
            return []

        email_ids = messages[0].split()
        if not email_ids:
            return []

        # Latest IDs are at the end
        latest_ids = email_ids[-n:]
        latest_ids.reverse()  # Fetch latest first

        print(f"Fetching {len(latest_ids)} emails...")
        emails = []
        for eid in latest_ids:
            try:
                status, msg_data = mail.fetch(eid, "(RFC822)")
                if status != "OK":
                    continue

                for res in msg_data:
                    if isinstance(res, tuple):
                        raw_email = res[1]
                        msg = email.message_from_bytes(raw_email)
                        
                        # Extract basic metadata
                        subject, encoding = decode_header(msg.get("Subject", "No Subject"))[0]
                        if isinstance(subject, bytes):
                            subject = subject.decode(encoding if encoding else "utf-8", errors="replace")
                        
                        sender, encoding = decode_header(msg.get("From", "Unknown"))[0]
                        if isinstance(sender, bytes):
                            sender = sender.decode(encoding if encoding else "utf-8", errors="replace")

                        date = msg.get("Date", "Unknown Date")
                        
                        # Extract body
                        body = ""
                        if msg.is_multipart():
                            for part in msg.walk():
                                content_type = part.get_content_type()
                                content_disposition = str(part.get("Content-Disposition"))
                                if content_type == "text/plain" and "attachment" not in content_disposition:
                                    body = part.get_payload(decode=True).decode("utf-8", errors="replace")
                                    break
                                elif content_type == "text/html" and not body:
                                    # Fallback to HTML if plain text not found yet
                                    body = part.get_payload(decode=True).decode("utf-8", errors="replace")
                        else:
                            body = msg.get_payload(decode=True).decode("utf-8", errors="replace")

                        emails.append({
                            "email_id": eid.decode(),
                            "sender": sender,
                            "subject": subject,
                            "date": date,
                            "body": body
                        })
            except Exception as e:
                print(f"Error fetching email ID {eid}: {e}")
                continue

        return emails
    except Exception as e:
        print(f"Error during email retrieval: {e}")
        return []
